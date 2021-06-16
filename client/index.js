// -----------read-----------------

document.addEventListener('DOMContentLoaded',function(){
    fetch('http://localhost:5001/getAll')
    .then(response=>response.json())
    .then(data=>loadHTMLTable(data['data']))
})

function loadHTMLTable(data){
    const table = document.querySelector('table tbody')
    // 没有数据时显示No Data
    if(data.length ===0){
        table.innerHTML = '<tr><td class="no-data" colspan="5">No Data</td></tr>'
        return
    }
    // 有数据时，显示数据。
    let tableHTML = ''
    data.forEach(({id,name,date_added}) => {
        tableHTML += '<tr>'
        tableHTML += `<td>${id}</td>`
        tableHTML += `<td>${name}</td>`
        tableHTML += `<td>${ new Date(date_added).toLocaleString()}</td>`
        tableHTML += `<td><button class='delete-row-btn' data-id=${id}>Delete</button></td>`
        tableHTML += `<td><button class='edit-row-btn' data-id=${id}>Edit</button></td>`
        tableHTML += '</tr>'
    });
    table.innerHTML = tableHTML
}

// -----------------insert---------------------------------------

const addBtn = document.querySelector('#add-name-btn')
addBtn.onclick = function(){
    const nameInput = document.querySelector('#name-input')
    const name = nameInput.value
    nameInput.value = ''
    // insert
    fetch('http://localhost:5001/insert',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({name:name})
    })
    .then(response=>response.json())
    .then(data=> insertRowIntoTable(data['data']))
}

function insertRowIntoTable(data){
    const table = document.querySelector('table tbody')
    const isNoDate = document.querySelector('.no-data')

    let tableHTML = '<tr>'
    for (var key in data){
        if(data.hasOwnProperty(key)){
            if(key==='dateAdded'){
                data[key] = new Date(data[key]).toLocaleString()
            }
            tableHTML += `<td>${data[key]}</td>`
        }
    }
    tableHTML += `<td><button class='delete-row-btn' data-id=${data.id}>Delete</button></td>`
    tableHTML += `<td><button class='edit-row-btn' data-id=${data.id}>Edit</button></td>`
    tableHTML += '</tr>'

    if(isNoDate){
        table.innerHTML = tableHTML
    }else{
        const newRow = table.insertRow()
        newRow.innerHTML = tableHTML
    }
}



document.querySelector('table tbody').addEventListener('click',function(event){
    // ----------delete----------------
    if(event.target.className ==='delete-row-btn'){
        deleteRowById(event.target.dataset.id)
    }
    // ----------update----------------
    if(event.target.className==='edit-row-btn'){
        handleEditRow(event.target.dataset.id)
    }
})

function deleteRowById(id){
    fetch('http://localhost:5001/delete/'+id,{
        method:'DELETE'
    })
    .then(response=>response.json())
    .then(data=> {
        if(data.success){
            // method one (建议使用):
            // fetch('http://localhost:5001/getAll')
            // .then(response=>response.json())
            // .then(data=>loadHTMLTable(data['data']))

            // method two (尽在教程中使用):
            location.reload()
        }
        
    })
}

function handleEditRow(id){
    const updateSection = document.querySelector('#update-row')
    // 显示section
    updateSection.hidden = false

    // 收集点击的元素的Id
    document.querySelector('#update-name-input').dataset.id = id
}
const updateBtn = document.querySelector('#update-row-btn')
updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input')
    fetch('http://localhost:5001/update',{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            id:updateNameInput.dataset.id,
            name:updateNameInput.value
        })
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            location.reload()
        }
    })
}

// ---search-----
const searchBtn = document.querySelector('#search-btn')
searchBtn.onclick = function (){
    const searchValue = document.querySelector('#search-input').value
    fetch('http://localhost:5001/search/' + searchValue)
    .then(response=>response.json())
    .then(data=>loadHTMLTable(data['data']))
}