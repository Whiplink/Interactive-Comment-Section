const comments = document.querySelector('.comments')
const commentBox = document.getElementById('comment-box')
const form = document.querySelector('.form__container')
const currentImage = document.getElementById('current-image')

const e = e => document.createElement(e)
const a = (x, el) => {
  let arr = []
  for(let i = 0; i < x; i++) {
    arr.push(e(el))
  }
  return arr
}

let data;
let upvoted = false
let downvoted = false

fetch('./data.json')
.then(res => res.json())
.then(fetchData => {
  data = fetchData
  currentImage.setAttribute('src', data.currentUser.image.webp)
  update()

  form.addEventListener('submit', e => {
    e.preventDefault()
    data.comments.push({
      id: generateId(),
      content: commentBox.value,
      createdAt: 'now',
      score: 0,
      user: {
        image: {
          png: data.currentUser.image.png,
          webp: data.currentUser.image.webp
        },
        username: data.currentUser.username
      },
      replies: []
    })
    update()
    commentBox.value = ''
  })
})

const generateId = () => {
  return Math.random()*1e16
}

const clearComments = () => {
  while(comments.firstChild) {
    comments.removeChild(comments.firstChild)
  }
}

const update = () => {
  clearComments()
  data.comments.forEach(x => {
    addComment(x)
  })
}

const addComment = ({ id, content, createdAt, score, replyingTo, user, replies}, isReply = {
  isreply: false,
  parent: null,
  parentId: null
}) => {


  const [Comment__container, Comment, Header, Body, Score, Buttons, RepliesContainer, You] = a(8, "div")
  const [Name, Created, MainScore, Reply_p, Delete_p, Edit_p] = a(6, 'p')
  const [Increment, Decrement, ReplyBtn, DeleteBtn, EditBtn] = a(5, 'button')
  const [Img, Plus, Minus, ReplyImg, DeleteImg, EditImg] = a(6, 'img')
  const [ReplyingTo__container, Content__container] = a(2, 'span')


  MainScore.textContent = score
  Name.textContent = user.username
  Created.textContent = createdAt
  ReplyingTo__container.textContent = `@${replyingTo} `
  Content__container.textContent = content
  if(replyingTo) {
    Body.append(ReplyingTo__container, Content__container)
  } else {

    Body.textContent = content
  }
  
  Plus.setAttribute('src', './images/icon-plus.svg')
  Minus.setAttribute('src', './images/icon-minus.svg')
  ReplyImg.setAttribute('src', './images/icon-reply.svg')
  DeleteImg.setAttribute('src', './images/icon-delete.svg')
  EditImg.setAttribute('src', './images/icon-edit.svg')
  Img.setAttribute('src', user.image.png)
  
  Comment__container.classList.add('comment__container')
  Comment.classList.add('comment')
  Score.classList.add('comment__score')
  Body.classList.add('comment__body')
  Header.classList.add('comment__header')
  Buttons.classList.add('comment__buttons')
  RepliesContainer.classList.add('replies__container')
  You.classList.add('you')
  ReplyBtn.classList.add('reply__btn')
  EditBtn.classList.add('edit__btn')
  DeleteBtn.classList.add('delete__btn')
  ReplyingTo__container.classList.add("ReplyingTo__container")
  
  
  Reply_p.textContent = 'Reply'
  Delete_p.textContent = 'Delete'
  Edit_p.textContent = 'Edit'
  You.textContent = 'you'
  
  if(data.currentUser.username == user.username) {
    Buttons.append(DeleteBtn, EditBtn)
    Header.append(Img, Name, You, Created)
    let editing = false
    EditBtn.addEventListener('click', () => {
      if (editing) return
      editing = true
      const editBox = e('textarea')
      const updateBtn = e('button')
      editBox.classList.add('edit__box')
      editBox.value = content
      updateBtn.classList.add('update__button')
      updateBtn.textContent = "UPDATE"
      Body.textContent = ''
      Comment.appendChild(updateBtn)
      Body.appendChild(editBox)
      editBox.focus()

      const cancel = e => {
        if (!Comment__container.contains(e.target)) {
          document.removeEventListener('click', cancel)
          editing = false
          update()
        }
      }

      updateBtn.addEventListener('click', () => {
        let comment;
        const findId = (arr) => {
          for(let i = 0; i < arr.length; i++) {
            if (arr[i].id != id) {
              if(arr[i].replies) {
                findId(arr[i].replies)
              }
            } else {
              comment = arr[i]
              break 
            }
          }
        }
        findId(data.comments)
        comment.content = editBox.value
        document.removeEventListener('click', cancel)
        editing = false
        update()
      })
    })
  } else {
    Buttons.appendChild(ReplyBtn)
    Header.append(Img, Name, Created)
  }
  
  Increment.appendChild(Plus)
  Decrement.appendChild(Minus)
  ReplyBtn.append(ReplyImg, Reply_p)
  DeleteBtn.append(DeleteImg, Delete_p)
  EditBtn.append(EditImg, Edit_p)
  
  Score.append(Increment, MainScore, Decrement)
  Comment.append(Score, Header, Body, Buttons)
  Comment__container.append(Comment, RepliesContainer)



  Increment.addEventListener('click', () => {
    let comment;
    const findId = (arr) => {
      for(let i = 0; i < arr.length; i++) {
        if (arr[i].id != id) {
          if(arr[i].replies) {
            findId(arr[i].replies)
          }
        } else {
          comment = arr[i]
          break 
        }
      }
    }
    findId(data.comments)
    comment.score++
    update()
  })
  Decrement.addEventListener('click', () => {
    let comment;
    const findId = (arr) => {
      for(let i = 0; i < arr.length; i++) {
        if (arr[i].id != id) {
          if(arr[i].replies) {
            findId(arr[i].replies)
          }
        } else {
          comment = arr[i]
          break 
        }
      }
    }
    findId(data.comments)
    comment.score--
    update()
  })

  ReplyBtn.addEventListener('click', () => {
    let comment;
    const findId = (arr) => {
      for(let i = 0; i < arr.length; i++) {
        if (arr[i].id != id) {
          if(arr[i].replies) {
            findId(arr[i].replies)
          }
        } else {
          comment = arr[i]
          break 
        }
      }
    }
    findId(data.comments)
    addReply(comment, Comment__container, RepliesContainer)
  })

  if(isReply.isreply) {
    isReply.parent.appendChild(Comment__container)

    DeleteBtn.addEventListener('click', () => {
      const [ModalContainer, Modal, Msg] = a(3, 'div')
      const h1 = e('h1')
      const [No, Yes] = a(2, 'button')

      h1.textContent = "Delete comment"
      Msg.textContent = "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
      No.textContent = 'NO, CANCEL'
      Yes.textContent = 'YES, DELETE'

      ModalContainer.classList.add('modal__container')

      Modal.append(h1, Msg, No, Yes)
      ModalContainer.appendChild(Modal)

      document.body.appendChild(ModalContainer)

      Yes.addEventListener('click', () => {
        let comment;
        const findId = (arr) => {
          for(let i = 0; i < arr.length; i++) {
            if (arr[i].id != isReply.parentId) {
              if(arr[i].replies) {
                findId(arr[i].replies)
              }
            } else {
              comment = arr[i]
              break 
            }
          }
        }
        findId(data.comments)
        comment.replies = comment.replies.filter(x => x.id != id)
        update()
        document.body.removeChild(ModalContainer)
      })
      No.addEventListener('click', () => {
        document.body.removeChild(ModalContainer)
      })
    })
  } else {
    comments.appendChild(Comment__container)

    DeleteBtn.addEventListener('click', () => {
      const [ModalContainer, Modal, Msg] = a(3, 'div')
      const h1 = e('h1')
      const [No, Yes] = a(2, 'button')

      h1.textContent = "Delete comment"
      Msg.textContent = "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
      No.textContent = 'NO, CANCEL'
      Yes.textContent = 'YES, DELETE'

      ModalContainer.classList.add('modal__container')

      Modal.append(h1, Msg, No, Yes)
      ModalContainer.appendChild(Modal)

      document.body.appendChild(ModalContainer)

      Yes.addEventListener('click', () => {
        data.comments = data.comments.filter(x => x.id != id)
        update()
        document.body.removeChild(ModalContainer)
      })
      No.addEventListener('click', () => {
        document.body.removeChild(ModalContainer)
      })
    })
  }
  if(replies){
    if (replies.length > 0) {
      replies.forEach(x => {
        addComment(x, {isreply: true, parent: RepliesContainer, parentId: id})
      })
    }
  }
}

let replying;

const addReply = (comment, container, repliesParent) => {
  if(replying) return
  replying = true
  const div = e('div')
  const img = e('img')
  const text = e('textarea')
  const replybtn = e('button')

  div.classList.add('addreply__container')
  img.setAttribute('src', data.currentUser.image.webp)
  replybtn.textContent = "REPLY"

  const cancel = e => {
    if (!container.contains(e.target)) {
      document.removeEventListener('click', cancel)
      replying = false
      update()
    }
  }
  document.addEventListener('click', cancel)

  replybtn.addEventListener('click', () => {
    const obj = {
      id: generateId(),
      content: text.value,
      createdAt: 'now',
      score: 0,
      replyingTo: comment.user.username,
      user: {
        image: {
          png: data.currentUser.image.png,
          webp: data.currentUser.image.webp
        },
        username: data.currentUser.username
      },
      replies: []
    }
    if (!comment.replies) {
      comment['replies'] = [obj]
      document.removeEventListener('click', cancel)
      replying = false
      update()
      return
    }
    comment.replies.push(obj)
    document.removeEventListener('click', cancel)
    replying = false
    update()
  })

  div.append(img, text, replybtn)
  container.insertBefore(div, repliesParent)
  text.focus()
}



