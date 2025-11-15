<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__contents">
        <span v-html="$t('footer.madeWith', { icon: heartIcon })"></span>
      </div>
    </div>
  </footer>
</template>
<script setup>
const heartIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="16"
  viewBox="0 0 18 16"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M13.1928 0.5C11.4388 0.5 10.0363 1.83291 9.16478 2.71542C8.27495 1.84024 6.84683 0.5 5.09647 0.5C2.53317 0.5 0.75351 2.30529 0.75351 4.89422C0.75351 10.5152 8.11749 15.1474 8.4434 15.3342C8.79874 15.5553 9.24886 15.5553 9.6042 15.3342C9.91546 15.1401 17.2465 10.4859 17.2465 4.89788C17.2209 2.18445 15.6792 0.5 13.1928 0.5Z"
    fill="#DD1804"
  />
</svg>
`;
</script>
