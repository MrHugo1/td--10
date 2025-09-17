window.CropManager = {
  // Extended crop definitions
  crops: {
    wheat: { 
      growTime: 8,
      emoji: "🌾", 
      yield: 2,
      baseValue: 1,
      machine: "mill",
      output: "flour"
    },
    corn: {
      growTime: 12,
      emoji: "🌽",
      yield: 3,
      baseValue: 2,
      machine: "popper",
      output: "popcorn"
    }
  },
  
  // Get crop by ID
  getCrop(id) {
    return this.crops[id] || null;
  },
  
  // Get all available crops
  getAvailableCrops() {
    return Object.keys(this.crops);
  },
  
  // Check if crop is unlocked
  isCropUnlocked(cropId) {
    // For now, all crops are unlocked
    // In future, this could check player progress
    return this.crops[cropId] !== undefined;
  },
  
  // Get crop value (for future economy system)
  getCropValue(cropId) {
    const crop = this.getCrop(cropId);
    return crop ? crop.baseValue : 0;
  },
  
  // Get machine for crop processing
  getCropMachine(cropId) {
    const crop = this.getCrop(cropId);
    return crop ? crop.machine : null;
  },
  
  // Get output product for crop
  getCropOutput(cropId) {
    const crop = this.getCrop(cropId);
    return crop ? crop.output : null;
  }
}; 