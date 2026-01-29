// Teacher's Subject App Hub - JavaScript Functionality

// PWA Installation Variables
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installButton = document.getElementById('installButton');
const dismissButton = document.getElementById('dismissButton');

document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const subjectForm = document.getElementById('subjectForm');
    const subjectSelect = document.getElementById('subject');
    const submitButton = subjectForm.querySelector('button[type="submit"]');

    // Form submission handler
    subjectForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // Get selected subject URL
        const selectedSubjectURL = subjectSelect.value;

        // Validate selection
        if (!selectedSubjectURL || selectedSubjectURL === '') {
            alert('Please select a subject before proceeding.');
            subjectSelect.focus();
            return;
        }

        // Visual feedback - button loading state
        submitButton.textContent = 'Opening App...';
        submitButton.disabled = true;

        // Open the selected subject app in a new tab
        window.open(selectedSubjectURL, '_blank');

        // Reset button after a short delay
        setTimeout(function() {
            submitButton.textContent = 'Go to App';
            submitButton.disabled = false;
            
            // Optional: Show success message
            showSuccessMessage();
        }, 1500);
    });

    // Enhanced select interaction
    subjectSelect.addEventListener('change', function() {
        if (this.value) {
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }
    });

    // Optional: Success message function
    function showSuccessMessage() {
        // You can add a success message div in HTML and show it here
        console.log('Subject app opened successfully!');
    }

    // Keyboard accessibility - Enter key on select
    subjectSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.value) {
                subjectForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Initial button state
    if (!subjectSelect.value) {
        submitButton.style.opacity = '0.9';
    }
});

// Optional: Analytics tracking (you can add Google Analytics or similar)
function trackSubjectAccess(subjectName) {
    console.log('Subject accessed:', subjectName);
    // Add your analytics code here if needed
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// PWA Install Prompt Handler
window.addEventListener('beforeinstallprompt', function(e) {
    // Prevent the default browser install prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show custom install banner
    if (installBanner) {
        installBanner.style.display = 'block';
    }
    
    console.log('PWA install prompt available');
});

// Install Button Click Handler
if (installButton) {
    installButton.addEventListener('click', async function() {
        if (!deferredPrompt) {
            alert('Installation not available. You may have already installed the app.');
            return;
        }
        
        // Show the browser's install prompt
        deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt
        deferredPrompt = null;
        
        // Hide the install banner
        if (installBanner) {
            installBanner.style.display = 'none';
        }
    });
}

// Dismiss Button Click Handler
if (dismissButton) {
    dismissButton.addEventListener('click', function() {
        if (installBanner) {
            installBanner.style.display = 'none';
        }
        console.log('User dismissed the install banner');
    });
}

// Detect if app is already installed
window.addEventListener('appinstalled', function(event) {
    console.log('PWA was installed successfully');
    
    // Hide install banner if visible
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    
    // Optional: Show success message
    alert('App installed successfully! You can now access it from your home screen.');
});

// Check if running as installed PWA
function isRunningStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches) || 
           (window.navigator.standalone) || 
           document.referrer.includes('android-app://');
}

if (isRunningStandalone()) {
    console.log('App is running in standalone mode (installed PWA)');
    // Hide install banner if app is already installed
    if (installBanner) {
        installBanner.style.display = 'none';
    }
}

// Online/Offline Status Detection
window.addEventListener('online', function() {
    console.log('App is online');
    // You can show a notification here if needed
});

window.addEventListener('offline', function() {
    console.log('App is offline - using cached content');
    // You can show a notification here if needed
});
