import { defineStore } from 'pinia'

export const useNovelStore = defineStore('novel', {
  state: () => ({
    novels: JSON.parse(localStorage.getItem('novels') || '[]')
  }),
  
  actions: {
    addNovel(novel) {
      novel.id = Date.now()
      this.novels.push(novel)
      this.saveToLocalStorage()
    },
    
    updateNovel(novel) {
      const index = this.novels.findIndex(n => n.id === novel.id)
      if (index !== -1) {
        this.novels[index] = novel
        this.saveToLocalStorage()
      }
    },
    
    deleteNovel(id) {
      this.novels = this.novels.filter(novel => novel.id !== id)
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      localStorage.setItem('novels', JSON.stringify(this.novels))
    }
  }
}) 