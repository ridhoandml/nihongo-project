import { defineStore } from "pinia";

export type ConfigKeys = "show-furigana" | "show-meaning"
export type Config = Record<ConfigKeys, boolean>

export const useConfig = defineStore('config', {
  state: () => {
    return {
      configs: {
        "show-furigana": false,
        "show-meaning": true
      } as Config
    }
  },
  actions: {
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