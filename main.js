const audio = document.getElementById("audio");
const fileInput = document.getElementById("fileInput");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const seekbar = document.getElementById("seekbar");

fileInput.addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;
	const objectUrl = URL.createObjectURL(file);
	audio.src = objectUrl;
	audio.play();
	title.textContent = file.name;
	artist.textContent = "Unknown Artist";
	cover.src = "https://via.placeholder.com/250";

	window.jsmediatags.read(file, {
		onSuccess: function (tag) {
			const tags = tag.tags;
			if (tags.title) title.textContent = tags.title;
			if (tags.artist) artist.textContent = tags.artist;
			if (tags.picture) {
				const { data, format } = tags.picture;
				let base64String = "";
				for (let i = 0; i < data.length; i++) {
					base64String += String.fromCharCode(data[i]);
				}
				cover.src = `data:${format};base64,${btoa(base64String)}`;
			}
		},

		onError: function (error) {
			console.log(error);
		},
	});
});

audio.addEventListener("timeupdate", () => {
	seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

seekbar.addEventListener("input", () => {
	audio.currentTime = (seekbar.value / 100) * audio.duration;
});
