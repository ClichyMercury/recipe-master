<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	
	let { children } = $props();
  </script>
  
  <div class="app">
	<Header />
	
	<main class="main">
	  {@render children()}
	</main>
	
	<Footer />
  </div>
  
  <style>
	.app {
	  display: flex;
	  flex-direction: column;
	  min-height: 100vh;
	}
	
	.main {
	  flex: 1;
	  padding: 2rem 0;
	}
	
	/* Styles globaux */
	:global(body) {
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	  margin: 0;
	  padding: 0;
	  color: #333;
	  line-height: 1.6;
	  background-color: #f9f9f9;
	}
	
	:global(*) {
	  box-sizing: border-box;
	}
	
	:global(h1, h2, h3, h4, h5, h6) {
	  margin-top: 0;
	  color: #333;
	  line-height: 1.2;
	}
	
	:global(a) {
	  color: #ff3e00;
	  text-decoration: none;
	}
	
	:global(a:hover) {
	  text-decoration: underline;
	}
	
	:global(.container) {
	  max-width: 1200px;
	  margin: 0 auto;
	  padding: 0 1rem;
	}
	
	:global(.page-title) {
	  font-size: 2rem;
	  margin-bottom: 1.5rem;
	}
  </style>