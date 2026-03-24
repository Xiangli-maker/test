// 🔴 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Submit review (limit to 12)
async function submitReview() {
  const name = document.getElementById("name").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  if (!name || !comment) {
    alert("Fill everything");
    return;
  }

  const snapshot = await db.collection("reviews").get();

  if (snapshot.size >= 12) {
    alert("Only 12 reviews allowed");
    return;
  }

  db.collection("reviews").add({
    name,
    rating,
    comment,
    time: Date.now()
  });

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";
}

// Real-time display
db.collection("reviews")
  .orderBy("time", "desc")
  .onSnapshot(snapshot => {
    const reviewsDiv = document.getElementById("reviews");
    reviewsDiv.innerHTML = "";

    snapshot.forEach(doc => {
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
