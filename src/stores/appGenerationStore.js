import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppGenerationStore = defineStore('appGeneration', () => {
  const configData = ref(null);

  function setConfigData(data) {
    configData.value = data;
  }

  function getConfigData() {
    return configData.value;
  }

  return {
    configData,
    setConfigData,
    getConfigData,
  };
}); 