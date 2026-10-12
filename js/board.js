let boardInited = false;
  async function initBoardOnce() {
    if (boardInited) return;
    boardInited = true;

    try {
      const { initializeApp } =
        await import("https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js");
      const { getFirestore, collection, addDoc, query, orderBy,
        onSnapshot, deleteDoc, doc, getDoc, setDoc, serverTimestamp } =
        await import("https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js");
      const {getAuth, signInAnonymously, onAuthStateChanged } =
        await import("https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js");

      const firebaseConfig = {
        apiKey: "AIzaSyDu7kx3msV9CvOzxD9ilKmWfzkT3YHFcMg",
        authDomain: "willsident-pj.firebaseapp.com",
        projectId: "willsident-pj",
        storageBucket: "willsident-pj.firebasestorage.app",
        messagingSenderId: "791017364363",
        appId: "1:791017364363:web:b2f1408377544c4de6ed8e"
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);

      const form = document.getElementById("b-form");
      const nameInput = document.getElementById("b-name");
      const messageInput = document.getElementById("b-msg");
      const list = document.getElementById("b-list");

      let uid = null;

      await signInAnonymously(auth);

      onAuthStateChanged(auth, user => {
        if (!user) return;

        uid = user.uid;

        form.onsubmit = async event => {
          event.preventDefault();

          const name = nameInput.value.trim();
          const message = messageInput.value.trim();

          if (!name || !message) return;

          try {
            await addDoc(collection(db, "comments"), {
              name: name.slice(0, 30),
              message: message.slice(0, 1000),
              timestamp: serverTimestamp(),
              uid: uid
            });
            form.reset();

          } catch (error) {
            console.error("書き込みエラー:", error);
          }
        };

        const commentsQuery = query(collection(db, "comments"), orderBy("timestamp", "desc"));

        onSnapshot(commentsQuery, snap => {
            list.innerHTML = "";

            snap.forEach(commentDoc => {
              const data = commentDoc.data();
              const id = commentDoc.id;

              const li = document.createElement("li");
              const header = document.createElement("div");
              const name = document.createElement("span");
              name.className = "name";
              name.textContent = data.name || "名無し";
              const date = document.createElement("span");
              date.className = "date";

              if (data.timestamp && typeof data.timestamp.toDate === "function")
                date.textContent = data.timestamp.toDate().toLocaleString("ja-JP");
              else
                date.textContent = "now";

              header.append(name, date);

              const message = document.createElement("div");
              message.className = "message";

              const text = data.message || "";

              const urlPattern = /(https?:\/\/[^\s]+)/g;

              let lastIndex = 0;
              let match;

              while ((match = urlPattern.exec(text)) !== null) {
                const beforeText = text.slice(lastIndex, match.index);

                if (beforeText) {
                  message.appendChild(document.createTextNode(beforeText));
                }

                const link = document.createElement("a");
                link.href = match[0];
                link.textContent = match[0];
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                message.appendChild(link);

                lastIndex = match.index + match[0].length;
              }

              const afterText = text.slice(lastIndex);

              if (afterText) {
                message.appendChild(document.createTextNode(afterText));
              }

              li.append(header, message);

              if (uid === data.uid) {
                const deleteButton = document.createElement("button");

                deleteButton.className = "delete-btn";
                deleteButton.textContent = "削除";

                deleteButton.addEventListener("click", async () => {
                  try {
                    await deleteDoc(doc(db, "comments", id));
                  } catch (error) {
                    console.error("削除エラー:", error);
                    alert("削除に失敗しました。\n" + error.message);
                  }
                });

                li.appendChild(deleteButton);
              }

              const likesArea = document.createElement("span");
              likesArea.className = "likes";

              li.appendChild(likesArea);
              list.appendChild(li);

              const likesCollection = collection(db, "comments", id, "likes");

              onSnapshot(likesCollection, async likeSnap => {
                const likeCount = likeSnap.size;
                const likeDoc = await getDoc(doc(likesCollection, uid));

                likesArea.innerHTML = "";
                const likeButton = document.createElement("button");

                likeButton.className = "like-btn" + (likeDoc.exists() ? " liked" : "");
                likeButton.textContent = `▲ ${likeCount}`;
                likeButton.addEventListener(
                  "click",
                  async () => {
                    const likeRef = doc(db, "comments", id, "likes", uid);
                    try {
                      if (likeDoc.exists())
                        await deleteDoc(likeRef);
                      else
                        await setDoc(likeRef, {liked: true});
                    } catch (error) {
                      console.error("いいねエラー:", error);
                      alert("いいねに失敗しました。\n" + error.message);
                    }
                  }
                );
                likesArea.appendChild(likeButton);
              });
            })
          },
          error => {
            console.error("掲示板読み込みエラー:", error);
            list.innerHTML = "";
            const li = document.createElement("li");
            li.className = "empty-message";
            li.textContent = "掲示板を読み込めませんでした。\n" + error.message;
            list.appendChild(li);
          }
        );
      });
    } catch (error) {
      console.error("掲示板初期化エラー:",error);
      boardInited = false;
      alert("掲示板を初期化できませんでした。\n\n" + error.message);
    }
  }
