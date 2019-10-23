import Button from '../components/button.js';
import Input from '../components/input.js';

const postColletion = firebase.firestore().collection('posts');

function btnSignOut() {
  firebase.auth().signOut().then(() => {
    window.location = '#login';
  })
}

function Home() {
  app.loadPosts();
  const template = `
    <nav class="menu">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#profile">Perfil</a></li>
      </ul>
      ${Button({ id: 'btn-exit', class: 'primary-button',  title: 'SAIR', onClick: btnSignOut })}
    </nav>
    <section class="new-post">
      <textarea class="txt-area" rows="5" cols="40" required placeholder="Qual é a sua meta de hoje?"></textarea>
      ${Button({ id: 'btn-print', title: 'Publicar', class: 'primary-button', onClick: btnPrint })}
      <select class="privacy" id="privacy">
        <option value="nune" selected>Privacidade</option>
        <option value="public">Público 🔓</option>
        <option value="private">Somente para mim 🔐</option>
      </select> 
    </section>
    <ul class="posts"></ul>
  `;
  return template;
}

function btnPrint() {
  const content = document.querySelector('.txt-area').value;
  const filterPrivacy = document.getElementById('privacy').value;
  // if (filterPrivacy === 'private') {
    
  // } else if (filterPrivacy === 'public') {
    
  // }
  //console.log(content)
  if (content !== null && content !== '') {
    const user = firebase.auth().currentUser;
    const post = {
      text: content,
      likes: 0,
      user_id: user.uid,
      user_name: user.displayName,
      coments: [],
      privacy: filterPrivacy,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    console.log(post)
    firebase.firestore().collection('posts').add(post).then(() => {
      app.loadPosts();
    });
    document.querySelector('.txt-area').value = '';
  }
}

function printPosts(post) {
  const postList = document.querySelector('.posts');
  const atual = firebase.auth().currentUser.uid;
  const autor = post.data().user_id
  let avatar = "https://api.adorable.io/avatars/70/" + post.data().user_name

  let postTemplate = `
		<li>
		  <img class="avatar" src=${avatar}></img>
		  <div id="post-area">
		    ${post.data().user_name}:
		    <span id="${post.id}">${post.data().text}</span>
		    <p>${post.data().timestamp.toDate().toLocaleString('pt-BR')}</p>
		    <div class="btn-icons">
			    <div class="commom-btn">
					  ${Button({dataId: post.id, class: 'btn-like', title: '❤️', onClick: like})}${post.data().likes}
            ${Button({ dataId: post.id, class: 'btn-comment', title: '💬', onClick: comment})}
          </div>    
        `
  if (atual == autor) {
    postTemplate += `
			<div class="author-btn">
			  ${Button({ dataId: post.id, class: 'btn-edit', title: '✏️', onClick: editPost})}
			  ${Button({ dataId: post.id, id: 'save-'+post.id, class: 'btn-save hidden', title: '✔️', onClick: save})}
			  ${Button({ dataId: post.id, class: 'btn-delete', title: '❌', onClick: deletePost})}
      </div>
   `
  }
  if (post.data().comments !== undefined) {
    console.log('pega essa bagaça', post.data().comments)
    postTemplate += `
      <div id='comment-div-${post.id}'>
        ${post.data().comments.map(item => `<p>${item.userName}: ${item.comment}</p>`).join('')}
      </div>
    `
  }
  postTemplate += `
        ${Input({ type: 'text', id: 'input-comment-'+post.id, dataId: post.id, class: 'input-comment hidden', placeholder: 'Escreva um comentário' })}
        ${Button({ id:'btn-comment-'+post.id, dataId: post.id, class: 'hidden', title: 'Manda ai', onClick: btnPrintComment })}
       </li>
       `
  postList.innerHTML += postTemplate;
}

function loadPosts() {
  postColletion.orderBy('timestamp').get().then((snap) => {
    document.querySelector('.posts').innerHTML = '';
    snap.forEach((post) => {
      printPosts(post);
    });
  });
}

function btnPrintComment(event) {
  const userName = firebase.auth().currentUser.displayName
  const postid = event.target.dataset.id;
  const comment = document.querySelector('#input-comment-'+postid).value
  db.collection('posts').doc().get().then(() => {
    const docPost = db.collection('posts').doc(postid)
    docPost.update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        userName,
        comment,
      })      
    })
}).then(() => {
    app.loadPosts()
  })
}

function comment() {
  const postid = event.target.dataset.id;
  document.getElementById('input-comment-' + postid).classList.remove('hidden');
  document.getElementById('btn-comment-' + postid).classList.remove('hidden');
}

function like(event) {
  const postid = event.target.dataset.id;
  db.collection('posts').doc(postid).get().then((doc) => {
    let newlike = (doc.data().likes) + 1;
    db.collection('posts').doc(postid)
      .update({
        likes: newlike,
      });
  }).then(() => {
    app.loadPosts();
  });
}

function deletePost(event) {
  const id = event.target.dataset.id;
  const postColletion = firebase.firestore().collection('posts');
  postColletion.doc(id).delete()
    .then(() => {
      console.log('Document successfully deleted!');
      app.loadPosts();
    });
}

function editPost(event) {
  const postid = event.target.dataset.id;
  const posteditor = document.getElementById(postid);
  posteditor.classList.add('edit-txt');
  posteditor.setAttribute('contenteditable', 'true');
  posteditor.focus();
  document.getElementById('save-' + postid).classList.remove('hidden');
}

function save(event) {
  const postid = event.target.dataset.id;
  const posteditor = document.getElementById(postid);
  const newtext = posteditor.textContent;
  db.collection('posts').doc(postid)
    .update({
      text: newtext,
    });
  posteditor.setAttribute('contenteditable', 'false');
  document.getElementById('save-' + postid).classList.add('hidden');
  app.loadPosts();
};

window.app = {
  loadPosts: loadPosts,
};

export default Home;
