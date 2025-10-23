/**
 * Reconstruction Saga
 * Handles all reconstruction-related side effects và workflows
 */

import {
  call,
  put,
  takeLatest,
  delay,
  race,
  take,
  cancelled,
  all,
} from 'redux-saga/effects';
import * as reconActions from '../actions/reconstructionActions';
import { reconstructionService } from '../../services/reconstruction.service';
import type { Scene, ReconstructionResult } from '../../types';
import type { ApiResponse } from '../../services/api.service';

// ========================================
// WORKER SAGAS
// ========================================

/**
 * Worker Saga: Create scene
 */
function* createSceneSaga(action: ReturnType<typeof reconActions.createSceneRequest>) {
  const requestId = action.meta.requestId;
  const { name, description } = action.payload;

  try {
    const response: ApiResponse<Scene> = yield call(reconstructionService.createScene, {
      name,
      description,
    });

    if (response.success && response.data) {
      yield put(reconActions.createSceneSuccess(response.data, requestId));
      console.log(`✅ Scene created: ${response.data.name} (ID: ${response.data.id})`);
    } else {
      throw new Error(response.message || 'Failed to create scene');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create scene';
    yield put(reconActions.createSceneFailure(errorMessage, requestId));
    console.error('❌ Create scene failed:', errorMessage);
  }
}

/**
 * Worker Saga: Fetch all scenes
 */
function* fetchScenesSaga(action: ReturnType<typeof reconActions.fetchScenesRequest>) {
  const requestId = action.meta.requestId;

  try {
    const response: ApiResponse<Scene[]> = yield call(reconstructionService.getScenes);

    if (response.success && response.data) {
      yield put(reconActions.fetchScenesSuccess(response.data, requestId));
      console.log(`✅ Fetched ${response.data.length} scenes`);
    } else {
      throw new Error(response.message || 'Failed to fetch scenes');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch scenes';
    yield put(reconActions.fetchScenesFailure(errorMessage, requestId));
    console.error('❌ Fetch scenes failed:', errorMessage);
  }
}

/**
 * Worker Saga: Fetch scene by ID
 */
function* fetchSceneByIdSaga(action: ReturnType<typeof reconActions.fetchSceneByIdRequest>) {
  const { sceneId } = action.payload;
  const requestId = action.meta.requestId;

  try {
    const response: ApiResponse<Scene> = yield call(
      reconstructionService.getSceneById,
      sceneId
    );

    if (response.success && response.data) {
      yield put(reconActions.fetchSceneByIdSuccess(response.data, requestId));
      console.log(`✅ Fetched scene: ${response.data.name}`);
    } else {
      throw new Error(response.message || 'Failed to fetch scene');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch scene';
    yield put(reconActions.fetchSceneByIdFailure(errorMessage, sceneId, requestId));
    console.error(`❌ Fetch scene ${sceneId} failed:`, errorMessage);
  }
}

/**
 * Worker Saga: Upload images
 */
function* uploadImagesSaga(action: ReturnType<typeof reconActions.uploadImagesRequest>) {
  const { sceneId, files } = action.payload;
  const requestId = action.meta.requestId;

  try {
    // Simulate progress updates (real progress would come from XMLHttpRequest)
    yield put(reconActions.uploadImagesProgress(10, requestId));
    yield delay(500);
    
    yield put(reconActions.uploadImagesProgress(30, requestId));
    
    const response: ApiResponse<Scene> = yield call(
      reconstructionService.uploadImages,
      sceneId,
      files
    );

    yield put(reconActions.uploadImagesProgress(90, requestId));
    yield delay(300);

    if (response.success && response.data) {
      yield put(reconActions.uploadImagesSuccess(response.data, requestId));
      console.log(`✅ Uploaded ${files.length} images to scene: ${sceneId}`);
    } else {
      throw new Error(response.message || 'Failed to upload images');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to upload images';
    yield put(reconActions.uploadImagesFailure(errorMessage, sceneId, requestId));
    console.error(`❌ Upload images to ${sceneId} failed:`, errorMessage);
  }
}

/**
 * Worker Saga: Run reconstruction
 */
function* runReconstructionSaga(action: ReturnType<typeof reconActions.runReconstructionRequest>) {
  const { sceneId } = action.payload;
  const requestId = action.meta.requestId;

  try {
    // Start reconstruction
    const response: ApiResponse<ReconstructionResult> = yield call(
      reconstructionService.runReconstruction,
      sceneId
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to start reconstruction');
    }

    console.log(`🚀 Reconstruction started for scene: ${sceneId}`);

    // Poll reconstruction status
    yield call(pollReconstructionStatus, sceneId, requestId);
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to run reconstruction';
    yield put(reconActions.runReconstructionFailure(errorMessage, sceneId, requestId));
    console.error(`❌ Reconstruction failed for ${sceneId}:`, errorMessage);
  }
}

/**
 * Helper Saga: Poll reconstruction status
 */
function* pollReconstructionStatus(sceneId: string, requestId?: string) {
  let progress = 0;

  while (true) {
    try {
      // Fetch scene status
      const response: ApiResponse<Scene> = yield call(
        reconstructionService.getSceneById,
        sceneId
      );

      if (response.success && response.data) {
        const scene = response.data;
        const { status } = scene;

        // Update progress based on status
        if (status === 'reconstruction_processing') {
          progress = Math.min(progress + 10, 90);
          yield put(reconActions.runReconstructionProgress(progress, status, requestId));
        } else if (status === 'reconstruction_completed' || status === 'completed') {
          yield put(reconActions.runReconstructionProgress(100, status, requestId));
          yield put(reconActions.runReconstructionSuccess(scene, requestId));
          console.log(`✅ Reconstruction completed for scene: ${sceneId}`);
          return;
        } else if (status === 'failed') {
          throw new Error('Reconstruction failed');
        }

        // Wait before next poll
        yield delay(5000); // Poll every 5 seconds
      } else {
        throw new Error(response.message || 'Failed to check status');
      }
    } catch (error: any) {
      yield put(
        reconActions.runReconstructionFailure(
          error.message || 'Reconstruction status check failed',
          sceneId,
          requestId
        )
      );
      return;
    }
  }
}

/**
 * Worker Saga: Full workflow (Create → Upload → Reconstruct)
 */
function* fullWorkflowSaga(action: ReturnType<typeof reconActions.startFullWorkflowRequest>): Generator<any, void, any> {
  const { data, files } = action.payload;

  try {
    // Step 1: Create Scene
    console.log('📝 Workflow Step 1: Creating scene...');
    yield put(reconActions.createSceneRequest(data));

    const createResult: { success?: any; failure?: any; cancel?: any } = yield race({
      success: take(reconActions.createSceneSuccess.type),
      failure: take(reconActions.createSceneFailure.type),
      cancel: take(reconActions.cancelWorkflow.type),
    });

    if (createResult.cancel) {
      console.log('❌ Workflow cancelled by user');
      return;
    }

    if (createResult.failure) {
      throw new Error('Failed to create scene');
    }

    const scene: Scene = createResult.success.payload;
    yield put(reconActions.workflowStepCompleted('scene_created', scene));

    // Step 2: Upload Images
    console.log('📤 Workflow Step 2: Uploading images...');
    yield put(reconActions.uploadImagesRequest(scene.id, files));

    const uploadResult: { success?: any; failure?: any; cancel?: any } = yield race({
      success: take(reconActions.uploadImagesSuccess.type),
      failure: take(reconActions.uploadImagesFailure.type),
      cancel: take(reconActions.cancelWorkflow.type),
    });

    if (uploadResult.cancel) {
      console.log('❌ Workflow cancelled by user');
      return;
    }

    if (uploadResult.failure) {
      throw new Error('Failed to upload images');
    }

    yield put(reconActions.workflowStepCompleted('images_uploaded', uploadResult.success.payload));

    // Step 3: Run Reconstruction
    console.log('🔨 Workflow Step 3: Running reconstruction...');
    yield put(reconActions.runReconstructionRequest(scene.id));

    const reconResult: { success?: any; failure?: any; cancel?: any } = yield race({
      success: take(reconActions.runReconstructionSuccess.type),
      failure: take(reconActions.runReconstructionFailure.type),
      cancel: take(reconActions.cancelWorkflow.type),
    });

    if (reconResult.cancel) {
      console.log('❌ Workflow cancelled by user');
      return;
    }

    if (reconResult.failure) {
      throw new Error('Failed to run reconstruction');
    }

    // Workflow Complete!
    const finalScene: Scene = reconResult.success.payload;
    yield put(reconActions.workflowCompleted(finalScene));
    console.log('🎉 Full workflow completed successfully!');
  } catch (error: any) {
    const errorMessage = error.message || 'Workflow failed';
    const failedStep = error.step || 'unknown';
    yield put(reconActions.workflowFailure(errorMessage, failedStep));
    console.error(`❌ Workflow failed at step ${failedStep}:`, errorMessage);
  } finally {
    if (yield cancelled()) {
      console.log('⚠️ Workflow was cancelled');
    }
  }
}

// ========================================
// WATCHER SAGA
// ========================================

export function* reconstructionSaga() {
  yield all([
    takeLatest(reconActions.createSceneRequest.type, createSceneSaga),
    takeLatest(reconActions.fetchScenesRequest.type, fetchScenesSaga),
    takeLatest(reconActions.fetchSceneByIdRequest.type, fetchSceneByIdSaga),
    takeLatest(reconActions.uploadImagesRequest.type, uploadImagesSaga),
    takeLatest(reconActions.runReconstructionRequest.type, runReconstructionSaga),
    takeLatest(reconActions.startFullWorkflowRequest.type, fullWorkflowSaga),
  ]);
}
