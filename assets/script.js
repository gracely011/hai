document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("openModalBtn");
    const videoModal = document.getElementById("videoModal");
    const videoElement = document.getElementById('videoElement');

    if (openModalBtn && videoModal && videoElement) {
        openModalBtn.addEventListener("click", () => {
            videoModal.style.display = "block";
            videoElement.currentTime = 0;
            videoElement.play();
        });

        window.addEventListener("click", (event) => {
            if (event.target === videoModal) {
                videoModal.style.display = "none";
                videoElement.pause();
            }
        });
    }
    
    const openModalBtnKiwi = document.getElementById("openModalBtnKiwi");
    const videoModalKiwi = document.getElementById("videoModalKiwi");
    const videoElementKiwi = document.getElementById('videoElementKiwi');

    if (openModalBtnKiwi && videoModalKiwi && videoElementKiwi) {
        openModalBtnKiwi.addEventListener("click", () => {
            videoModalKiwi.style.display = "block";
            videoElementKiwi.currentTime = 0;
            videoElementKiwi.play();
        });

        window.addEventListener("click", (event) => {
            if (event.target === videoModalKiwi) {
                videoModalKiwi.style.display = "none";
                videoElementKiwi.pause();
            }
        });
    }
    
        const openModalBtnOrion = document.getElementById("openModalBtnOrion");
    const videoModalOrion = document.getElementById("videoModalOrion");
    const videoElementOrion = document.getElementById('videoElementOrion');

    if (openModalBtnOrion && videoModalOrion && videoElementOrion) {
        openModalBtnOrion.addEventListener("click", () => {
            videoModalOrion.style.display = "block";
            videoElementOrion.currentTime = 0;
            videoElementOrion.play();
        });

        window.addEventListener("click", (event) => {
            if (event.target === videoModalOrion) {
                videoModalOrion.style.display = "none";
                videoElementOrion.pause();
            }
        });
    }

    console.log('%cgroupy', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
    console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
    console.log('%ccontact@groupy.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');

    let currentNotification = 0;
    const notifications = document.querySelectorAll(".notificationModal");
  
    // Show the first notification
    if (notifications.length > 0) {
      showNotification(currentNotification);
    }
  
    function showNotification(index) {
      if (notifications[index]) {
        notifications[index].style.display = "flex"; // Show modal
      }
    }
  
    function closeNotification(index) {
      if (notifications[index]) {
        notifications[index].style.display = "none"; // Hide current modal
        currentNotification++;
  
        // Show the next notification
        if (notifications[currentNotification]) {
          showNotification(currentNotification);
        }
      }
    }
  
    // Expose the closeNotification function to the global scope
    window.closeNotification = closeNotification;
});