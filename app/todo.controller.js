(function(angular) {

    'use strict';

    angular
        .module('todoApp')
        .controller('TodoController', TodoController);

    TodoController.$inject = ['storageService','$mdDialog'];


    function TodoController(storageService, $mdDialog) {
        var vm = this;

        vm.selectedItem = null;
        vm.items = storageService.get() || [];
        vm.notDone = notDone;
        vm.done = done;
        vm.all = all;
        vm.deleteItem = deleteItem;
        vm.createItem = createItem;
        vm.addTask = addTask;
        vm.updateItem = updateItem;

        vm.priorities = [];
        vm.priorities.push({title: 'High', value: 1});
        vm.priorities.push({title: 'Medium', value: 0});
        vm.priorities.push({title: 'Low', value: -1});
        
        vm.tags = [];
        vm.tags.family = false;
        vm.tags.friends = false;
        vm.tags.fun = false;
        vm.tags.work = false;

        vm.cancel = cancel;
        vm.answer = answer;

        vm.update = update;


        vm.toggleAll = toggleAll;
        vm.listAll = [];
        vm.auxLength = null;
        vm.checkAll = 0;

        vm.listSelected = [];
        
     

        function notDone(item) {
            return item.done == false;
        }

        function done(item) {
            return item.done == true;
        }

        function all(item) {
            return true;
        }

        
        function deleteItem(ev) {
            console.log("PRIMA ISTr");
            //Caso 1 cancella l'item selected'
            if (vm.selectedItem != null && vm.listSelected.length < 2 && vm.listAll.length < vm.items.length) {
                console.log("DENTRO 1 IF DEL DELETE");
               
                var confirm = $mdDialog.confirm()

                .textContent('The task "' + vm.selectedItem.title + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                        console.log("Quanto vale selectedItem?");
                        console.log(vm.selectedItem);
                        var index = vm.items.indexOf(vm.selectedItem);
                        console.log("QUANTO VALE INDEX?");
                        console.log(index);
                        if (index != -1) {
                            vm.items.splice(index, 1);
                            storageService.set(vm.items);
                            vm.selectedItem =null;
                        }
                    }
                })
                .catch(function() {
                    vm.auxLength = null;
                    vm.checkAll = 0;
                    vm.listSelected.length=0;
                    vm.listAll.length=0;
                    vm.checkAll = 0;
                    vm.selectedItem = null;
                });
                return;
            }
            //Caso 2 : cancella tutta la lista degli item selezionati
            if (vm.listAll.length == vm.items.length) {
               //  vm.listSelected = vm.listAll;
                console.log("DENTRO 2 IF DEL DELETE");
                var confirm;
       
                confirm = $mdDialog.confirm()

                .textContent('All tasks will be deleted. Are you sure?')
                    .ariaLabel('Delete tasks')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function(result) {
                    if (result) {
                            console.log("SE HAI PREMUTO CANCEL NON DOVRESTI VEDERMI");
                            vm.items.length = 0;
                            vm.listAll.length = 0;
                            vm.listSelected.length = 0;
                            vm.auxLength = 0;
                            storageService.set(vm.items);
                            vm.selectedItem =null;
                            vm.checkAll = 0;
                        
                    }
                })
                .catch(function() {
                    vm.auxLength = null;
                    vm.checkAll = 0;
                    vm.listSelected.length=0;
                    vm.listAll.length=0;
                    vm.checkAll = 0;
                    vm.selectedItem = null;
                });
                return;

        }
        else vm.auxLength = null;


        //Caso 3: cancella una porzione dell'intera lista degli item
        if(vm.listSelected.length > 1 && vm.listSelected.length <= vm.items.length && vm.listAll.length < vm.items.length){
            console.log("DENTRO 3 IF DEL DELETE");
            var i = 0, j = vm.listSelected.length-1;
            for (i = 0 ; i < vm.listSelected.length ; i++){
                console.log("DIM listselec");
                console.log(vm.listSelected.length);
                var confirm = $mdDialog.confirm()

                .textContent('The task "' + vm.listSelected[i].title + '" will be deleted. Are you sure?')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                    console.log(vm.items);
                    console.log("list selected---->");
                    console.log(vm.listSelected[i].title);
                   // i=0;

                $mdDialog.show(confirm).then(function(result) {
                    console.log("Prima istr del then ");
                    console.log("VALORE DI J ----->")
                    console.log(j);
                    if (result) {
                            var index = vm.items.indexOf(vm.listSelected[j]);
                            console.log("VALORE index ----->")
                            console.log(index);
                            if (index != -1) {
                                vm.items.splice(index, 1);
                                storageService.set(vm.items);
                                //vm.listAll.splice(index, 1);
                                vm.selectedItem =null;
                                vm.listSelected.length --;
                                console.log("VALORE DI J ----->");
                                console.log(j);
                                j--;
                                return;
                            }
                            
                        
                    }
                })
               .catch(function() {
                   j--;
                    var i =  vm.listSelected.length; 
                    console.log("Entro nel for?");
                    console.log(i = vm.listSelected.length);
                    for (i = vm.listSelected.length; i>=0; i--){
                        console.log("Dentro catch, valore di i:");
                        console.log(i);
                        if (vm.listSelected[i]!= null) {
                            console.log("CI SONOOOO");
                            vm.listSelected.splice(i,1);
                            if(i==0) vm.selectedItem = null;
                            break;

                         }
                    }            
                });
            }
        } 
    

   }


        //Creates a new item with the given parameters
        function createItem(title, description, priority, done, date, eworks,tags) {
            vm.items.push({
                title: title,
                description: description,
                done: done || false,
                priority: priority || 0,
                date: date || Date.now,
                eworks: eworks,
                tags: tags,
            });
            storageService.set(vm.items);
            console.log(vm.items);
        }



// funzione che permette di fare l'update dell'item  selezionato
        function updateItem(ev){
            console.log("SONO IN UPDATE ITEM");
            console.log(vm.selectedItem);
            if(vm.selectedItem!= null){
               if (vm.selectedItem.date && !(vm.selectedItem.date instanceof Date)) {
                	if (typeof vm.selectedItem.date === "string")
      		            vm.selectedItem.date = new Date(vm.selectedItem.date);
      	        if (Object.prototype.toString.call(vm.selectedItem.date) !== "[object Date]")
      		        throw Error('The ng-model for md-datepicker must be a Date instance. ' +
				'Currently the model is a: ' + (typeof vm.selectedItem.date));
              }

                console.log("Dentro IF UPDATE");
                console.log(vm.selectedItem);
                $mdDialog.show({
                controller: TodoController,
                controllerAs: 'ctrl',                   
                templateUrl: 'pages/updateTask.html',
                bindToController:true,

                locals: {
                  selItem: vm.selectedItem,
                },


                 
                 //parent: angular.element(document.body),
                 targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(item) {
                var i = 0;
                if (item){
                    console.log("############.then if item");
                    for(i=0;i<vm.items.length;i++){
                        console.log(".then dentro for");
                        if(vm.items[i].title == vm.selectedItem.title){
                            console.log(".then dentro if del for");
                            vm.items[i].title = item.title;
                            vm.items[i].priority = item.priority;
                            vm.items[i].done = item.done;
                            vm.items[i].date = item.date;
                            vm.items[i].description = item.description;
                            vm.items[i].eworks = item.eworks;
                            vm.items[i].tags =item.tags;
                            console.log(vm.items);
                            storageService.set(vm.items);
                            vm.selectedItem =null;
                            break;
                        }
                        console.log(".then NON SONO ENTRATO NEL for");
                    }
                }
                
            })
            .catch(function() {
                 vm.auxLength = null;
                vm.checkAll = 0;
                vm.listSelected.length=0;
                vm.listAll.length=0;
                vm.checkAll = 0;
                vm.selectedItem = null;
           });

        };
        
      }


        //Add a new task to the items list 
    function addTask(ev) {
 


        $mdDialog.show({
        controller: TodoController,
        controllerAs: 'ctrl',
        templateUrl: 'pages/taskManagement.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
        })
        .then(function(answer) {
            //title, description, priority, done, date,eworks
                if (answer)
                    vm.createItem(answer.title,answer.description,answer.priority,answer.done,answer.date, answer.eworks, answer.tags);
        });
     
    }

    // funziona che rigetta la promise $mdDialog.show
     function cancel() {
             $mdDialog.cancel();
           };

//funzione che risolve la promise $mdDialog.show per il createItem
        function answer(title, description, priority, done, date,eworks, tags) {
             var answer = {
                 title: title,
                 description: description,
                 priority: priority,
                 done: done,
                 date: date,
                 eworks: eworks,
                 tags: tags,
             }
             $mdDialog.hide(answer);
           };


//funzione che risolve la promise $mdDialog.show per l'updateItem
        function update(title, description, priority, done, date,eworks, tags) {
               // console.log("bellezza afrodisiaca");
                var item = {
                    title: title,
                    description: description,
                    priority:priority,
                    done:done,
                    date:date,
                    eworks:eworks,
                    tags:tags,
                }
                $mdDialog.hide(item);
            };




//funzione che permette di selezionare tutti gli item insieme
             function toggleAll(ev){
                 if(vm.checkAll == 1 && vm.listAll.length == 0) vm.checkAll = 0;
                 console.log("Dentro il toggle All");
                 vm.auxLength = 0;
                  var i = 0;
                  if(vm.listAll.length == vm.items.length) vm.listAll.length = 0;

                  if(vm.checkAll == 0 && vm.items.length !=0){

                        for(i = 0; i < vm.items.length ; i ++){
                            console.log("Dentro il FOR DEL toggle All");

                            vm.listAll.push(vm.items[i]);
                            console.log(vm.items[i]);
        
                        }  
                        vm.auxLength = vm.listAll.length;
        //                  console.log("Controllo la len del listALl");
        //                console.log(vm.auxLength);
                        vm.checkAll =1;
                        return; 
                    }
                    if(vm.checkAll == 1){
                        vm.listAll.length = 0;
                        vm.checkAll = 0;
                        return;
                    }
            
                }








}

})(window.angular);