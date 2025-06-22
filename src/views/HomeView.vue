<template>
	<div>
		<h1 class="title">Welcome to the TRT+ Toolbox</h1>
		<p>A collection of tools to help with your TRT+ protocol.</p>
		<p>Please make sure to create an account and login to see everything.</p>


	</div>

	<div class="card has-background-black-ter">
		<header class="card-header">
			<p class="card-header-title">Component</p>
			<span class="card-header-icon no-cursor" aria-label="more options">
				<span class="icon">
					<MUI name="more_vert" class="mui-icon" size=24 fill=0 weight=400></MUI>
				</span>
			</span>
		</header>
		<div class="card-content">
			<div class="content">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
				iaculis mauris.
				<a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
				<br />
				<time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
			</div>
		</div>
		<footer class="card-footer">
			<a href="#" class="card-footer-item">Save</a>
			<a href="#" class="card-footer-item">Edit</a>
			<a href="#" class="card-footer-item">Delete</a>
		</footer>
	</div>
</template>

<script>
import MUI from '@/components/icons/MUI.vue'
export default {
    name: 'HomeView',
    components: {
            MUI
    },
    data() {
            return {
               
            }
    },
    methods: {

    }
}
</script>