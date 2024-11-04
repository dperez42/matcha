<template>
    <div class="dropzone">
        <div class="dropzone-container" id="dropzone" :style="active && 'background-color: green;'"
            @drop.prevent="handleDrop"
            @dragenter.prevent="setActive"
            @dragleave.prevent="setInactive"
        >
                <div v-if="active">
                    <img class="imag" :src="img_tmp" alt="">
                    <div>Drop Them</div>
                    {{urla}}
                </div>
                <div v-else>
                    <img class="imag" :src="img_tmp" alt="">
                    <div>Drag Your Files Here</div>
                    <input type="file" @input="handleInput($event)"><input/>
                    {{urla}}
                </div>

            <!--<img v-if="user && user.images" class="h-auto w-full mx-auto" :src="avatar" alt="">-->
            <!--
            <img class="imag" :src="imge" alt="">
            <input type="file" class="absolute inset-0 w-full h-full opacity-100 z-150" 
                @input="handleInput($event as InputEvent)"
            />
            <h3>
                <label for="file-upload" class="relative cursor-pointer">
                    <span>Drag and drop</span>
                    <span class="text-blue-500"> or browse </span>
                    <span>to upload</span>
                </label>
            </h3>
            <p>
                PNG, JPG, GIF up to 1MB
            </p>
            -->
        </div>
    </div>
</template>
  
<script setup lang="ts"> 
import {computed, onMounted, onUnmounted, ref} from 'vue';
import { toast, type ToastOptions } from 'vue3-toastify';
import { useStore } from 'vuex';

const { imge } = defineProps({
	imge: {
		type: String,
		default: 'https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img1.jpg'
	},
});
let img_tmp = ref('')         // Create `active` state and manage it with function
let active = ref(false)         // Create `active` state and manage it with functions
let urla = ref('')
let inActiveTimeout = null      // add a variable to hold the timeout key
const emit = defineEmits(["upload"]); //define emit to send file

const events = ["dragenter", "dragleave", "dragover", "drop"] // events in drop zone
//
const store = useStore();
//const user = computed(() => store.state.user.user);
//const user = store.state.user.user;
// creo una imagen temporal
//const image_tmp = ref('api/user/' + user.value.images)
const image_tmp = ref('https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img1.jpg')
/*
let imagePath = 'api/user/';
if (user && user.images) {
    imagePath = 'api/user/' + user.images;
}
const image_tmp = ref(imagePath)
*/

const notify = (msg:string) => {
    toast(msg, {
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions);
}
// function to add a listener preventDefault
function preventDefaults(e) {
    e.preventDefault()
}
// When active inside drag zone
function setActive() {
    active.value = true
    clearTimeout(inActiveTimeout) // clear the timeout
}
// When inactive outside drag zone
function setInactive() {
    // wrap it in a `setTimeout`
    inActiveTimeout = setTimeout(() => {
        active.value = false
    }, 50)
}
// create listeners ["dragenter", "dragleave", "dragover", "drop"] 
onMounted(() => {
    img_tmp.value = imge.valueOf()
      events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults)
    })
})
// remove all listeners
onUnmounted(() => {
      events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults)
    })
})
// Check if input is not null, just one, less of 1M, a is Valid Image for Drop
function handleDrop(e: DragEvent): void {
    const files = e.dataTransfer?.files as FileList;

    if (files.length === 0) {
        console.log("No files dropped.");
        return;
    }
    if (files.length > 1) {
        console.log("Only one file allowed.");
        notify('Only One File');
        return;
    }
    const file = files[0];
    if (!isValidImage(file)) {
        notify('Please enter a valid image file');
        return;
    }

    const url = window.URL || window.webkitURL;
    const image = new Image();
    image.onload = function() {
        notify('Valid image file');
        emit("upload", { name: file.name, url: URL.createObjectURL(file), file });
        image_tmp.value = URL.createObjectURL(file)
    };
    image.onerror = function() {
        notify('Invalid image file');
    };
    image.src = url.createObjectURL(file);
        urla.value = image.src
    img_tmp.value  = image.src
}
// Check if is a valid image
function isValidImage(file: File): boolean {
    const [fileType] = file.type.split("/");
    return fileType === "image";
}
// Check if input is not null, just one, less of 1M, a is Valid Image for Input
function handleInput(e: InputEvent): void {
    setInactive() // add this line too
    const files = (e.target as HTMLInputElement).files as FileList;

    if (files.length === 0) {
        console.log("No files selected.");
        return;
    }

    if (files.length > 1) {
        console.log("Only one file allowed.");
        notify('Only One File');
        return;
    }
    const file = files[0];
    if (file.size >= 1000000) {
        notify('Please enter a image file with less 1 MB');
        return;
    }
    if (!isValidImage(file)) {
        notify('Please enter a valid image file');
        return;
    }


    const url = window.URL || window.webkitURL;
    const image = new Image();
    image.onload = function() {
        notify('Uploading image file');
        emit("upload", { name: file.name, url: URL.createObjectURL(file), file });
        image_tmp.value = URL.createObjectURL(file)
    };
    image.onerror = function() {
        notify('Invalid image file');
    };
    image.src = url.createObjectURL(file);
    urla.value = image.src
    img_tmp.value  = image.src
}

</script>
<style scoped>
.dropzone{
    width: 100px;
    height: 100px; 
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: blueviolet;
}
.dropzone-container {
    padding: 4rem;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
}

.hidden-input {
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
}

.file-label {
    font-size: 20px;
    display: block;
    cursor: pointer;
}

.preview-container {
    display: flex;
    margin-top: 2rem;
}

.preview-card {
    display: flex;
    border: 1px solid #a2a2a2;
    padding: 5px;
    margin-left: 5px;
}

.preview-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a2a2a2;
    background-color: #a2a2a2;
}
</style>