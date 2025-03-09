<template>
  <div class="h-screen w-screen flex flex-col justify-start overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex flex-col self-center gap-4 p-8 w-full max-w-[600px]">
        <div class="flex gap-1 sm:gap-3 flex-col sm:flex-row justify-between items-center">
          <h1 class="text-2xl font-bold">Remembered Word</h1>
          <span class="text-base">{{ level.toUpperCase() }} - {{ type }} ({{ savedDataCount }} - {{ flashcardData?.length }})</span>
        </div>
        <div class="flex gap-4">
          <label v-for="key in Object.keys(configs)">
            <input
              class="border-none outline-none"
              :value="(configs as Record<string, boolean>)[key]"
              v-model="(configs as Record<string, boolean>)[key]"
              type="checkbox"
              name="config-saved"
              :id="key"
            >
            {{ key }}
          </label>
        </div>
        <div class="flex gap-3 justify-between">
          <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
          <button @click="startLearning" class="flex justify-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Start Learning
          </button>
        </div>
      </div>
      <div class="flex flex-col items-center overflow-scroll">
        <div class="max-w-[900px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-8 pb-8">
          <FlashcardWord 
            v-for="flashcard in flashcardData"
            :flashcard="flashcard"
            v-model:saved-flashcard="savedData"
          /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { JLPTLevel, TypeFlashCard } from './FlashcardSelector.vue';
import FlashcardWord from '@/components/FlashcardWord.vue';
import { useConfig, type Config } from '@/store/config';
import { storeToRefs } from 'pinia';

export interface JapaneseWordInterface {
  kanji: string,
  furigana: string
  translation: string
  check: boolean
}

export type JapaneseWordSaved = Record<string, boolean>

const jsonFiles = import.meta.glob('/public/jlpt-*/**/*.json', { eager: true })
const config = useConfig()
const { getConfigFromLocal: configs } = storeToRefs(config)

const router = useRouter();
const route = useRoute();
const level = route.params.level as JLPTLevel
const type = route.params.type as TypeFlashCard
const savedData = ref<JapaneseWordSaved>({})

const flashcardData = computed(() => {
  for (const [path, moduleUnknown] of Object.entries(jsonFiles)) {
    const category = path.split('/').pop()?.replace('.json', '')
    if (path.includes(level) && type === category) {
      const module = moduleUnknown as { default: JapaneseWordInterface[] }
      return module.default
    }
  }
})
const savedDataCount = computed(() => {
  return Object.values(savedData.value).filter(value => value).length
})

const isLoaded = loadSelection()
if (isLoaded) savedData.value = isLoaded

watch(savedData, () => saveSelection(), { deep: true })
watch(configs, (v) => config.setAllConfig(v), { deep: true })

function saveSelection () {
  localStorage.setItem(`saved-${level}-${type}`, JSON.stringify(savedData.value));
}

function loadSelection (): JapaneseWordSaved | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

function startLearning() {
  router.push({ name: 'Flashcard' });
}

function back() {
  router.push({ name: 'Home' });
}
</script>