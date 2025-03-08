<template>
  <div class="h-screen w-screen flex items-center justify-center p-8">
    <div class="flex grow flex-col max-w-[400px] justify-center gap-4">
      <div class="flex items-center gap-8">
        <h1 class="flex grow text-1xl">Flashcard {{ level.toUpperCase() }} {{ type }} - Current {{ currentIndex }} of {{ cards.length }}</h1>
        <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
      </div>
      <div v-if="cards.length > 0" class="flex grow flex-col">
        <div class="p-4 rounded h-64 text-center border border-gray-800">
          <div class="text-5xl mb-4">{{ currentCard.kanji }}</div>
          <div v-if="showDetails" class="mt-2 flex flex-col">
            <div class="text-2xl text-gray-300 mb-2">{{ currentCard.furigana }}</div>
            <div class="text-2xl text-gray-100">{{ currentCard.translation }}</div>
          </div>
        </div>
  
        <div class="mt-4 flex gap-2">
          <button @click="prevCard" class="flex justify-center flex-auto px-4 py-2 bg-gray-800 rounded cursor-pointer">
            <i class='bx bx-chevrons-left text-2xl' ></i>
          </button>
          <div class="flex grow gap-2">
            <button @click="speak" class="flex justify-center flex-auto px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
              <i class='bx bxs-user-voice text-2xl' ></i>
            </button>
            <button @click="toggleDetails" class="flex justify-center flex-auto px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
              <div v-if="showDetails" class="flex items-center justify-center">
                <i class=' bx bx-hide text-2xl'></i>
              </div>
              <div v-else class="flex items-center justify-center">
                <i class='bx bx-show text-2xl'></i>
              </div>
            </button>
          </div>
          <button @click="nextCard" class="flex justify-center flex-auto px-4 py-2 bg-gray-800 rounded cursor-pointer">
            <i class='bx bx-chevrons-right text-2xl' ></i>
          </button>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { JLPTLevel, TypeFlashCard } from './FlashcardSelector.vue';
import type { JapaneseWordInterface } from './WordCheck.vue';

const router = useRouter();
const route = useRoute();
const level = route.params.level as JLPTLevel;
const type = route.params.type as TypeFlashCard;

const jsonPath = `/jlpt-${level}/${type}.json`;

const cards = ref<JapaneseWordInterface[]>([]);
const currentIndex = ref(0);
const showDetails = ref(false);

const currentCard = computed(() => cards.value[currentIndex.value] || {});

async function loadCards() {
  const res = await fetch(jsonPath)
  const rememberedCards = loadSelection()
  const json = await res.json() as JapaneseWordInterface[]
  cards.value = rememberedCards ? json.filter(item => !rememberedCards[item.kanji]) : json
}

function nextCard() {
  if (currentIndex.value < cards.value.length - 1) currentIndex.value++;
  else currentIndex.value = 0;
  showDetails.value = false;
}

function prevCard() {
  if (currentIndex.value > 0) currentIndex.value--;
  else currentIndex.value = cards.value.length - 1;
  showDetails.value = false;
}

function toggleDetails() {
  showDetails.value = !showDetails.value;
}

function speak() {
  const text = currentCard.value.furigana || currentCard.value.kanji;
  const utterance = new SpeechSynthesisUtterance(text);

  // Find Japanese female voice
  const voices = speechSynthesis.getVoices();
  const japaneseVoice = voices.filter( voice => voice.lang === 'ja-JP')
  const defaultVoice = voices.find( voice => voice.lang === 'ja-JP')
  const google = japaneseVoice.find( voice => voice.name.includes("Google"))

  if (google) {
    utterance.voice = google;
  } else if (defaultVoice) {
    utterance.voice = defaultVoice;
  }

  utterance.lang = 'ja-JP';
  utterance.rate = 1; // slower (default is 1)
  utterance.pitch = 1; // slightly higher pitch (default is 1)
  utterance.volume = 1; // max volume

  speechSynthesis.speak(utterance);
}

onMounted(loadCards)

function loadSelection (): Record<string, boolean> | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

function back () {
  router.push({ name: 'WordCheck', params: { level, type } });
}
</script>
