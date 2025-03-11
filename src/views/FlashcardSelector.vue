<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
    <h1 class="text-2xl font-bold">Japanese Simple Flashcard</h1>
    <h3 class="text-lg">Choose JLPT Level</h3>
    <div class="flex gap-4">
      <label class="flex items-center gap-2">
        <input type="radio" value="n5" v-model="selectedLevel" />
        N5
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="n4" v-model="selectedLevel" />
        N4
      </label>
    </div>

    <h3 class="text-lg">Choose a Category</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        v-for="type in types"
        :key="type"
        class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        @click="selectType(type)"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export type JLPTLevel = "n5" | "n4";
export type TypeFlashCard = "noun" | "katakana-noun" | "adverb" | "verb" | "adjective-i" | "adjective-na" | "bunpou" | "particles" | "kanji"

const config = useConfig()
const { getGlobalConfigFromLocal: globalConfig } = storeToRefs(config)

const router = useRouter();
const selectedLevel = ref<JLPTLevel>(globalConfig.value.level as JLPTLevel)
const types = ref<TypeFlashCard[]>(["noun", "katakana-noun", "adverb", "verb", "adjective-i", "adjective-na", "bunpou", "particles", "kanji"])

watch(selectedLevel, (v) => config.setGlobalConfig("level", v))

function selectType(type: string) {
  router.push({ name: 'WordCheck', params: { level: selectedLevel.value, type } });
}
</script>
