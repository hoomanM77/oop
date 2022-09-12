////////////////////Variables//////////////////////////////////////
const $=document
const postForm=_id('post-form')
const titleInput=_id('title')
const writerInput=_id('writer')
const messageInput=_id('message')
const postContainer=_id('post-container')
const postAlert=_q('.post-alert')
let postArray=[]
/////////////// Catching Elements with functions////////////////////
function _id(tag) {
    return  $.getElementById(tag)
}
function _class(tag) {
    return $.getElementsByClassName(tag)
}
function _q(tag) {
    return $.querySelector(tag)
}
function _qAll(tag) {
    return $.querySelectorAll(tag)
}
//////////////////////////// post class ///////////////////////
class Post {
    constructor(id,title,writer,message) {
        this.id=id
        this.title=title
        this.writer=writer
        this.message=message
    }
    static addNewPost(){
        let titleInputValue=titleInput.value
        let writerInputValue=writerInput.value
        let messageInputValue=messageInput.value
        let ui=new UI();
        if(isNaN(titleInput.value) && isNaN(writerInput.value) && isNaN(messageInput.value) ){
            //////// generate new row
            ui.rowGenerator(postArray.length,titleInputValue,writerInputValue,messageInputValue)
            ////// set data and push to array
            let newPost=new Post(postArray.length,titleInputValue,writerInputValue,messageInputValue)
            Post.setData(newPost)
            ////// alert for adding row
            UI.successfulAlert()

        }else{
            ////// alert for adding row
            UI.errorAlert()
        }
    }
    static setData(newPost){
        postArray.push(newPost)
        localStorage.setItem('postList',JSON.stringify(postArray))
        Post.clearPostField()
    }
    static clearPostField(){
        titleInput.value=''
        writerInput.value=''
        messageInput.value=''
    }
    static updateData(targetTag){
       let tagId=targetTag.dataset.id
       let removedTagIndex=postArray.findIndex(function (post) {
           return post.id===Number(tagId)
       })
        postArray.splice(removedTagIndex,1)
        localStorage.setItem('postList',JSON.stringify(postArray))
    }
}
//////////////// UI class  //////////////////////////////
class UI {
    rowGenerator(id,titleInputValue,writerInputValue,messageInputValue){
         postContainer.insertAdjacentHTML('beforeend','<tr>\n' +
                '                        <th class="fw-bold" scope="row">'+titleInputValue+'</th>\n' +
                '                        <td >'+writerInputValue+'</td>\n' +
                '                        <td>'+messageInputValue+'</td>\n' +
                '                        <td><i class="bi bi-x fs-3 text-danger d-inline-flex" onclick="UI.removeRow(event)" data-id="'+id+'"></i></td>\n' +
                '                    </tr>')
    }
    static removeRow(e){
        e.target.parentElement.parentElement.remove()
        Post.updateData(e.target)
        UI.removedPostAlert()
    }
    static successfulAlert(){
        postAlert.innerHTML='Your Post added Successfully!'
        postAlert.style.backgroundColor='#198754 '
        setTimeout(function () {
            postAlert.innerHTML=''
        },3000)
    }
    static errorAlert(){
        postAlert.innerHTML='All fields are necessary!'
        postAlert.style.backgroundColor='#dc3545 '
        setTimeout(function () {
            postAlert.innerHTML=''
        },3000)
    }
    static removedPostAlert(){
        postAlert.innerHTML='Your post has been removed!'
        postAlert.style.backgroundColor='#ccc'
        setTimeout(function () {
            postAlert.innerHTML=''
        },3000)
    }
}
/////////////////// local storage class //////////////////////
class LocalStorage {
    static restoreData(){
        Post.clearPostField()
        let postList=JSON.parse(localStorage.getItem('postList'))
        let ui=new UI();
        if(postList){
            postList.forEach(function (post) {
                ui.rowGenerator(post.id,post.title,post.writer,post.message)
                postArray.push(post)
            })
        }

    }

}
function addNewPost(e) {
    e.preventDefault()
    Post.addNewPost()
}
window.addEventListener('load',LocalStorage.restoreData)
postForm.addEventListener('submit',addNewPost)