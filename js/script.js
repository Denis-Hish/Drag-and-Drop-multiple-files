const dropArea = document.querySelector('.drop-section');
const listSection = document.querySelector('.list-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

// upload files with browse button
// загрузка файла с помошью кнопки "обзор / обзор файла"
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
   [...fileSelectorInput.files].forEach(file => {
      if (typeValidation(file.type)) {
         uploadFile(file);
      }
   });
};

// when file is over the drag area
// когда файл находится в области перетаскивания
dropArea.ondragover = e => {
   e.preventDefault();
   [...e.dataTransfer.items].forEach(item => {
      if (typeValidation(item.type)) {
         dropArea.classList.add('drag-over-effect');
      }
   });
};

// when file liave the drag area
// когда файл покидает область перетаскивания
dropArea.ondragleave = () => {
   dropArea.classList.remove('drag-over-effect');
};

// when file drop on the drag area
// когда файл попадает в область перетаскивания
dropArea.ondrop = e => {
   e.preventDefault();
   dropArea.classList.remove('drag-over-effect');
   if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach(item => {
         if (item.kind === 'file') {
            const file = item.getAsFile();
            if (typeValidation(file.type)) {
               uploadFile(file);
            }
         }
      });
   } else {
      [...e.dataTransfer.files].forEach(file => {
         if (typeValidation(file.type)) {
            uploadFile(file);
         }
      });
   }
};

// check the file type
// проверка типа файда
function typeValidation(type) {
   var splitType = type.split('/')[0];
   if (
      type == 'application/pdf' ||
      splitType == 'image' ||
      splitType == 'video'
   ) {
      return true;
   }
}

// upload file
// загрузка файла
function uploadFile(file) {
   listSection.style.display = 'block';
   var li = document.createElement('li');
   li.classList.add('in-prog');
   li.innerHTML = `
       <div class="col">
           <img src="img/${iconSelector(file.type)}" alt="">
       </div>
       <div class="col">
           <div class="file-name">
               <div class="name">${file.name}</div>
               <span>0%</span>
           </div>
           <div class="file-progress">
               <span></span>
           </div>
           <div class="file-size">${(file.size / (1024 * 1024)).toFixed(
              2
           )} Mb</div>
       </div>
       <div class="col">
           <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
           <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
       </div>
   `;
   listContainer.prepend(li);
   var http = new XMLHttpRequest();
   var data = new FormData();
   data.append('file', file);
   http.onload = () => {
      li.classList.add('complete');
      li.classList.remove('in-prog');
   };
   http.upload.onprogress = e => {
      var percent_complete = (e.loaded / e.total) * 100;
      li.querySelectorAll('span')[0].innerHTML =
         Math.round(percent_complete) + '%';
      li.querySelectorAll('span')[1].style.width = percent_complete + '%';
   };
   http.open('POST', '../sender.php', true);
   http.send(data);
   li.querySelector('.cross').onclick = () => http.abort();
   http.onabort = () => li.remove();
}
// find icon for file
// найти значок файла
function iconSelector(type) {
   var splitType =
      type.split('/')[0] == 'application'
         ? type.split('/')[1]
         : type.split('/')[0];
   return splitType + '.png';
}
