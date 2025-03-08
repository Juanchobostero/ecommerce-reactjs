import { useEffect } from "react";

const TopButton = () => {

    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    // Get the button:
    let mybutton = document.getElementById("myBtn");

    // Check if the button exists before trying to access it
    if (mybutton) {
        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function() {scrollFunction()};
		mybutton.addEventListener("click", topFunction);
    }

    function scrollFunction() {
        if (mybutton && (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
            mybutton.style.display = "block";
            mybutton.style.zIndex = "2000";
        } else if (mybutton) {
            mybutton.style.display = "none";
        }
    }

    useEffect(() => {
        console.log("TopButton montado");
      }, []);

    return (
        <button class="bg-black/50" id="myBtn" title="Go to top">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/>
            </svg>

        </button>
    )
}

export default TopButton