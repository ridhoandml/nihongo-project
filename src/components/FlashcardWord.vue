<template>
  <label
    :id="flashcard.kanji"
    class="h-24 w-full relative flex flex-col gap-1 p-2 border border-slate-800 rounded">
    <input
      class="absolute top-2 right-2 border-none outline-none"
      :value="savedFlashcard[flashcard.kanji]"
      v-model="savedFlashcard[flashcard.kanji]"
      type="checkbox"
      name="saved"
      :id="flashcard.kanji"
    >
    <div class="flex gap-3 items-center">
      <span class="text-xl">{{ flashcard.kanji }}</span>
      <span v-if="configs['show-furigana']" class="text-xs text-gray-300">{{ flashcard.furigana }}</span>
    </div>
    <span v-if="configs['show-meaning']" class="text-sm text-gray-100 line-clamp-2">{{ flashcard.translation }}</span>
  </label>
</template>

<script setup lang="ts">
import type { JapaneseWordInterface, JapaneseWordSaved } from '@/views/WordCheck.vue';
import { defineProps } from 'vue'
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';

const config = useConfig()
const { getConfigFromLocal: configs } = storeToRefs(config)

defineProps<{
  flashcard: JapaneseWordInterface
  savedFlashcard: JapaneseWordSaved
}>()
</script>
