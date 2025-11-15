<template>
  <div class="no-tests-found">
    <img :src="imageUrl" alt="No tests found" class="no-tests-found__image" />
    <div class="no-tests-found__message">No matching tests found.</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  imageName: {
    type: String,
    default: 'item-not-found.svg',
  },
});

const imageUrl = computed(() => {
  return new URL(`../assets/images/misc/${props.imageName}`, import.meta.url).href;
});
</script>

<style lang="scss" scoped>
.no-tests-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.no-tests-found__image {
  max-width: 200px;
  margin-bottom: 8px;
}

.no-tests-found__message {
  font-size: 16px;
  color: #9A9A9A;
}
</style>