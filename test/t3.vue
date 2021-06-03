<template>
  <div v-show="value" class="vue-image-crop-upload" data-auid="a6441fe66168">
    <div class="vicp-wrap" data-auid="3f731dda8c69">
      <div class="vicp-close" data-auid="0a08ac713fa1" @click="off">
        <i class="vicp-icon4" data-auid="ab2f25b49715" />
      </div>

      <div v-show="step == 1" class="vicp-step1" data-auid="d33352b11e37">
        <div class="vicp-drop-area" data-auid="e9683741fecf@2" @dragleave="preventDefault" @dragover="preventDefault" @dragenter="preventDefault" @click="handleClick" @drop="handleChange">
          <i v-show="loading != 1" class="vicp-icon1" data-auid="f7e24fe3063d@2">
            <i class="vicp-icon1-arrow" data-auid="60f96a49bb76" />
            <i class="vicp-icon1-body" data-auid="aa01ea263d85" />
            <i class="vicp-icon1-bottom" data-auid="9fc1e778d21a" />
          </i>
          <span v-show="loading !== 1" class="vicp-hint" data-auid="cd5fe418cc2e">{{ lang.hint }}</span>
          <span v-show="!isSupported" class="vicp-no-supported-hint" data-auid="7de271a936fc">{{ lang.noSupported }}</span>
          <input v-if="step == 1" v-show="false" ref="fileinput" type="file" data-auid="2e22d1c1a57a" @change="handleChange">
        </div>
        <div v-show="hasError" class="vicp-error" data-auid="f2cb33f33456@2">
          <i class="vicp-icon2" data-auid="f7e24fe3063d@2" />
          {{ errorMsg }}
        </div>
        <div class="vicp-operate" data-auid="be62744253b1">
          <a data-auid="4279aef22b56@2" @click="off" @mousedown="ripple">{{ lang.btn.off }}</a>
        </div>
      </div>

      <div v-if="step == 2" class="vicp-step2" data-auid="b67e6dc18784">
        <div class="vicp-crop" data-auid="e9683741fecf@2">
          <div v-show="true" class="vicp-crop-left" data-auid="410158758991">
            <div class="vicp-img-container" data-auid="085e2e821f58@2">
              <img ref="img" class="vicp-img" draggable="false" data-auid="3524860af42f" :src="sourceImgUrl" :style="sourceImgStyle" @drag="preventDefault" @dragstart="preventDefault" @dragend="preventDefault" @dragleave="preventDefault" @dragover="preventDefault" @dragenter="preventDefault" @drop="preventDefault" @touchstart="imgStartMove" @touchmove="imgMove" @touchend="createImg" @touchcancel="createImg" @mousedown="imgStartMove" @mousemove="imgMove" @mouseup="createImg" @mouseout="createImg">
              <div class="vicp-img-shade vicp-img-shade-1" data-auid="c4f85d4914a2@2" :style="sourceImgShadeStyle" />
              <div class="vicp-img-shade vicp-img-shade-2" data-auid="ab6a374e5954" :style="sourceImgShadeStyle" />
            </div>

            <div class="vicp-range" data-auid="0743b5682b4e">
              <input type="range" step="1" min="0" max="100" data-auid="429a44d4104a" :value="scale.range" @input="zoomChange">
              <i class="vicp-icon5" data-auid="4f46bb21b986@2" @mousedown="startZoomSub" @mouseout="endZoomSub" @mouseup="endZoomSub" />
              <i class="vicp-icon6" data-auid="4f67c323b19d" @mousedown="startZoomAdd" @mouseout="endZoomAdd" @mouseup="endZoomAdd" />
            </div>

            <div v-if="!noRotate" class="vicp-rotate" data-auid="4a8449191e1a">
              <i data-auid="8dd863b5fd82" @mousedown="startRotateLeft" @mouseout="endRotate" @mouseup="endRotate">↺</i>
              <i data-auid="4f46bb21b986@2" @mousedown="startRotateRight" @mouseout="endRotate" @mouseup="endRotate">↻</i>
            </div>
          </div>
          <div v-show="true" class="vicp-crop-right" data-auid="c540580af820@2">
            <div class="vicp-preview" data-auid="085e2e821f58@2">
              <div v-if="!noSquare" class="vicp-preview-item" data-auid="440dfe12c1dc">
                <img data-auid="df9f3d6455c0@2" :src="createImgUrl" :style="previewStyle">
                <span data-auid="873df6896980@2">{{ lang.preview }}</span>
              </div>
              <div v-if="!noCircle" class="vicp-preview-item vicp-preview-item-circle" data-auid="c4f85d4914a2@2">
                <img data-auid="df9f3d6455c0@2" :src="createImgUrl" :style="previewStyle">
                <span data-auid="873df6896980@2">{{ lang.preview }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vicp-operate" data-auid="f2cb33f33456@2">
          <a data-auid="4279aef22b56@2" @click="setStep(1)" @mousedown="ripple">{{ lang.btn.back }}</a>
          <a class="vicp-operate-btn" data-auid="e582016a5d57@2" @click="prepareUpload" @mousedown="ripple">{{ lang.btn.save }}</a>
        </div>
      </div>

      <div v-if="step == 3" class="vicp-step3" data-auid="ba8f6d2cf674">
        <div class="vicp-upload" data-auid="e9683741fecf@2">
          <span v-show="loading === 1" class="vicp-loading" data-auid="d847160a72fa">{{ lang.loading }}</span>
          <div class="vicp-progress-wrap" data-auid="c540580af820@2">
            <span v-show="loading === 1" class="vicp-progress" data-auid="b4072a27faf8" :style="progressStyle" />
          </div>
          <div v-show="hasError" class="vicp-error" data-auid="1231e1861b66">
            <i class="vicp-icon2" data-auid="6fb8c465f072@2" />
            {{ errorMsg }}
          </div>
          <div v-show="loading === 2" class="vicp-success" data-auid="466c18639b35">
            <i class="vicp-icon3" data-auid="6fb8c465f072@2" />
            {{ lang.success }}
          </div>
        </div>
        <div class="vicp-operate" data-auid="f2cb33f33456@2">
          <a data-auid="4279aef22b56@2" @click="setStep(2)" @mousedown="ripple">{{ lang.btn.back }}</a>
          <a data-auid="e582016a5d57@2" @click="off" @mousedown="ripple">{{ lang.btn.close }}</a>
        </div>
      </div>
      <canvas v-show="false" ref="canvas" data-auid="16dacb137ba4" :width="width" :height="height" />
    </div>
  </div>
</template>