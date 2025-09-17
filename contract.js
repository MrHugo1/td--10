window.ContractManager = {
  currentContract: {
    breadRequired: 15,
    popcornRequired: 10,
    reward: { coins: 80, pipeParts: 2 },
    completed: false
  },
  coins: 0,
  pipeParts: 0,
  
  // Tạo hợp đồng mới
  generateNewContract() {
    this.currentContract = GameBalance.generateContract();
  },
  
  // Kiểm tra có thể giao hàng không
  canDeliver() {
    return SiloManager.bread && SiloManager.bread.stored >= this.currentContract.breadRequired &&
           SiloManager.popcorn && SiloManager.popcorn.stored >= this.currentContract.popcornRequired;
  },
  
  // Giao hàng và nhận thưởng
  deliver() {
    if (this.canDeliver() && !this.currentContract.completed) {
      // Trừ bread và popcorn từ silo
      SiloManager.takeFromSilo("bread", this.currentContract.breadRequired);
      SiloManager.takeFromSilo("popcorn", this.currentContract.popcornRequired);
      
      // Nhận thưởng
      this.coins += this.currentContract.reward.coins;
      this.pipeParts += this.currentContract.reward.pipeParts;
      
      // Đánh dấu hoàn thành
      this.currentContract.completed = true;
      
      console.log(`Contract completed! Received ${this.currentContract.reward.coins} coins and ${this.currentContract.reward.pipeParts} pipe parts`);
      
      return true;
    }
    return false;
  },
  
  // Tạo hợp đồng mới sau khi hoàn thành
  completeAndGenerateNew() {
    if (this.currentContract.completed) {
      this.generateNewContract();
    }
  },
  
  render() {
    const p = document.getElementById('contract-panel');
    const canDeliver = this.canDeliver();
    const breadStored = SiloManager.bread ? SiloManager.bread.stored : 0;
    const popcornStored = SiloManager.popcorn ? SiloManager.popcorn.stored : 0;
    
    p.innerHTML = `
      <h3>Contract Board</h3>
      <div class="contract-details">
        <div>Required: <b>${this.currentContract.breadRequired}</b> Bread</div>
        <div>Available: <b>${breadStored}</b> Bread</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min((breadStored / this.currentContract.breadRequired) * 100, 100)}%"></div>
        </div>
        <div>Required: <b>${this.currentContract.popcornRequired}</b> Popcorn</div>
        <div>Available: <b>${popcornStored}</b> Popcorn</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min((popcornStored / this.currentContract.popcornRequired) * 100, 100)}%"></div>
        </div>
      </div>
      <div class="reward-info">
        <div>Reward: <b>${this.currentContract.reward.coins}</b> Coins</div>
        <div>+ <b>${this.currentContract.reward.pipeParts}</b> Pipe Parts</div>
      </div>
      <button id="deliver-btn" class="deliver-btn ${canDeliver ? 'ready' : 'disabled'}" 
              ${canDeliver ? 'onclick="ContractManager.deliver()"' : 'disabled'}>
        ${this.currentContract.completed ? 'Completed!' : 'Deliver'}
      </button>
      ${this.currentContract.completed ? '<button onclick="ContractManager.completeAndGenerateNew()">New Contract</button>' : ''}
    `;
  },
  
  tick() {
    // Tự động tạo hợp đồng mới nếu chưa có
    if (!this.currentContract) {
      this.generateNewContract();
    }
    this.render();
  }
}; 