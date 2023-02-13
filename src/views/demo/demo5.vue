<template>
  <div class="root">
    <transition-group tag="div" class="container">
      <div
          class="item"
          :class="'item' + i"
          v-for="(item, i) in items"
          :key="item.key"
          :style="{ 'background-color': item.color, border: '1px solid' }"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          @dragover.prevent="handleDragOver($event, item)"
          @dragenter="handleDragEnter($event, item)"
          @dragend="handleDragEnd($event, item)"
      >
        <div>{{ item }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {
      items: [
        { key: 1, color: "#3883a0" },
        { key: 2, color: "#4883a0" },
        { key: 3, color: "#5883a0" },
        { key: 4, color: "#6883a0" },
        { key: 5, color: "#7883a0" },
        { key: 6, color: "#8883a0" },
        { key: 7, color: "#9883a0" },
      ],
      ending: null,
      dragging: null,
    };
  },
  methods: {
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      if (this.ending.key === this.dragging.key) {
        return;
      }
      let newItems = [...this.items];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(this.ending);
      newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]));
      console.log(newItems);

      this.items = newItems;
      this.$nextTick(() => {
        this.dragging = null;
        this.ending = null;
      });
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move";
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = "move";
      this.ending = item;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 200px;
  height: 200px;
  margin: 10px;
  color: #fff;
  transition: all linear 0.3s;
}
.item0 {
  width: 400px;
}
</style>
