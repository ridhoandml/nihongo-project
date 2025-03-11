import type { JLPTLevel } from "@/views/FlashcardSelector.vue";
import { defineStore } from "pinia";

export type ConfigKeys = "show-furigana" | "show-meaning"
export type Config = Record<ConfigKeys, boolean>

export const useConfig = defineStore('config', {
  state: () => {
    return {
      level: "n5" as JLPTLevel,
      configs: {
        "show-furigana": false,
        "show-meaning": true
      } as Config
    }
  },
  actions: {
    setLevel (value: JLPTLevel) {
      this.level = value
      localStorage.setItem('level', JSON.stringify(this.level))
    },
    setConfig(key: ConfigKeys, value: boolean) {
      this.configs[key] = value
      localStorage.setItem('saved-config', JSON.stringify(this.configs))
    },
    setAllConfig(configs: Config) {
      this.configs = configs
      localStorage.setItem('saved-config', JSON.stringify(this.configs))
    }
  },
  getters: {
    getLevel(state) {
      return state.level
    },
    getLevelFromLocal(state) {
      const data = localStorage.getItem(`level`)
      if (!data) {
        localStorage.setItem('level', JSON.stringify(state.level))
        return state.level
      }
      state.level = JSON.parse(data) as JLPTLevel
      return state.level
    },
    getConfig(state) {
      return state.configs
    },
    getConfigFromLocal(state) {
      const data = localStorage.getItem(`saved-config`)
      if (!data) return state.configs
      state.configs = JSON.parse(data) as Config
      return state.configs
    }
  },
})