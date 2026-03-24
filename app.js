// Firebase (modular v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔴 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCx0hTlL7PYk8z01qmBqw2RswWjPPwEbjc",
  authDomain: "happybirthay-b8c0d.firebaseapp.com",
  projectId: "happybirthay-b8c0d",
  storageBucket: "happybirthay-b8c0d.appspot.com",
  messagingSenderId: "52519306440",
  appId: "1:52519306440:web:0415d22f3a5ac5b94951fd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔐 Keep track of submitted names (simple anti-duplicate)
const submittedNames = new Set();

// ✅ Submit review
window.submitReview = async function () {
  const name = document.getElementById("name").value.trim();
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) {
    alert("Please fill all fields");
    return;
  }

  // Prevent duplicate names (optional but recommended)
  if (submittedNames.has(name.toLowerCase())) {
    alert("You already submitted a review!");
    return;
  }

  // Limit to 12 reviews
  const snapshot = await getDocs(collection(db, "reviews"));

  if (snapshot.size >= 12) {
    alert("Only 12 reviews allowed");
    return;
  }

  await addDoc(collection(db, "reviews"), {
    name,
    rating: Number(rating),
    comment,
    time: Date.now()
  });

  submittedNames.add(name.toLowerCase());

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";
};

// 🔄 Real-time display
const q = query(collection(db, "reviews"), orderBy("time", "desc"));

onSnapshot(q, (snapshot) => {
  const reviewsDiv = document.getElementById("reviews");
  reviewsDiv.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "review";

    div.innerHTML = `
      <h4>${data.name} - ${"⭐".repeat(data.rating)}</h4>
      <p>${data.comment}</p>
    `;

    reviewsDiv.appendChild(div);
  });
});
