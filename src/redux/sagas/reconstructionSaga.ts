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
import type { Scene } from '../../types';
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
 * Worker Saga: Run reconstruction (sử dụng Full Pipeline API với Status Polling)
 */
function* runReconstructionSaga(action: ReturnType<typeof reconActions.runReconstructionRequest>) {
  const { sceneId } = action.payload;
  const requestId = action.meta.requestId;

  try {
    console.log('\n========================================');
    console.log('🚀 [SAGA] BẮT ĐẦU FULL PIPELINE');
    console.log('========================================');
    console.log(`📋 Scene ID: ${sceneId}`);

    // Bước 1: Kiểm tra scene readiness
    console.log('🔍 [SAGA] Bước 1: Kiểm tra scene readiness...');
    yield put(reconActions.runReconstructionProgress(5, 'Đang kiểm tra scene...', requestId));

    const checkResponse: ApiResponse<any> = yield call(
      reconstructionService.checkSceneReadiness,
      sceneId
    );

    if (!checkResponse.success || !checkResponse.data) {
      throw new Error('Không thể kiểm tra scene');
    }

    const sceneStatus = checkResponse.data;
    console.log('📊 [SAGA] Scene status:', sceneStatus);
    console.log(`   - Has Images: ${sceneStatus.hasImages} (${sceneStatus.imageCount} ảnh)`);
    console.log(`   - Has COLMAP: ${sceneStatus.hasColmap}`);
    console.log(`   - Can Run: ${sceneStatus.canRunColmap}`);
    console.log(`   - Next Step: ${sceneStatus.nextStep}`);

    if (!sceneStatus.hasImages) {
      throw new Error('Scene chưa có ảnh. Vui lòng upload ảnh trước.');
    }

    // Bước 2: Start Full Pipeline (không đợi response)
    console.log('\n🔄 [SAGA] Bước 2: Khởi động Full Pipeline (COLMAP → 3D Reconstruction)...');
    yield put(reconActions.runReconstructionProgress(10, 'Đang khởi động pipeline...', requestId));

    const startTime = Date.now();
    
    // Call Full Pipeline API (fire and forget - sẽ chạy background)
    // Không cần await vì ta sẽ poll status
    reconstructionService.runFullPipeline(sceneId).catch((err) => {
      console.error('❌ Pipeline error:', err);
    });

    // Bước 3: Poll status cho đến khi complete hoặc failed
    console.log('📊 [SAGA] Bước 3: Bắt đầu polling status (mỗi 20 giây)...\n');
    
    let isComplete = false;
    let lastProgress = 10;

    while (!isComplete) {
      // Delay 20 seconds giữa các lần poll
      yield delay(20000);

      try {
        // Sử dụng getSceneById để lấy detail với progress
        const sceneResponse: ApiResponse<any> = yield call(
          reconstructionService.getSceneById,
          sceneId
        );

        if (sceneResponse.success && sceneResponse.data) {
          const scene = sceneResponse.data;
          
          console.log(`📊 [POLLING] Status: ${scene.status} | Progress: ${scene.progress}% | ${scene.progressMessage}`);

          // Update progress
          if (scene.progress !== lastProgress) {
            yield put(reconActions.runReconstructionProgress(
              scene.progress,
              scene.progressMessage,
              requestId
            ));
            lastProgress = scene.progress;
          }

          // Check if complete
          if (scene.status === 'completed') {
            isComplete = true;
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);

            console.log('\n✅ [SAGA] PIPELINE HOÀN TẤT!');
            console.log('========================================');
            console.log(`⏱️  Tổng thời gian: ${duration}s`);
            console.log(`📊 Final Status: ${scene.status}`);
            console.log(`📊 Progress: ${scene.progress}%`);
            console.log('========================================\n');

            yield put(reconActions.runReconstructionSuccess(scene, requestId));
            console.log(`✅ Reconstruction completed for scene: ${sceneId}`);
          } else if (scene.status === 'failed') {
            isComplete = true;
            throw new Error('Pipeline thất bại: ' + scene.progressMessage);
          }
        } else {
          console.warn('⚠️ [POLLING] Không lấy được scene detail, retry...');
        }
      } catch (pollError: any) {
        console.error('❌ [POLLING] Lỗi khi poll status:', pollError.message);
        // Nếu poll error, vẫn tiếp tục thử (có thể là network glitch)
        // Nhưng nếu quá nhiều lần lỗi thì nên stop
      }
    }

  } catch (error: any) {
    console.error('\n========================================');
    console.error('❌ [SAGA] PIPELINE FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('========================================\n');

    const errorMessage = error.message || 'Failed to run reconstruction';
    yield put(reconActions.runReconstructionFailure(errorMessage, sceneId, requestId));
    console.error(`❌ Reconstruction failed for ${sceneId}:`, errorMessage);
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
