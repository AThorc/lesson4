(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', directive);

    function directive() {
        return {
            scope: {},
            bindToController: {
                items: '=',
                selectedItem: '=',
                filterFunction: '=',
                listAll: '=',
                listSelected: '=',
                update: '=',
                delete: '=',
            },
            controller: customListController,
            controllerAs: 'customListCtrl',
            transclude: true,
            restrict: 'E',
            templateUrl: 'app/components/customList.template.html' 
        };
    }


    customListController.$inject = ['storageService'];

    //Directive controller
    function customListController(storageService) {
        var vm = this;
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection

        //Changes the priority of the given item
        function changePriority(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        function checkStateChanged() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        function toggleSelection(item) {

            // non c'è nessun elemento nella lista dei selezionati 
            if (vm.selectedItem == null && vm.listSelected.length == 0 && vm.listAll.length==0){
                vm.selectedItem = item;
                vm.listSelected.push(item);
                console.log("1 -----> non c'è nessun elemento nella lista dei selezionati")
                console.log(vm.selectedItem);
                return;
       
            }

            // è gia stato selezionato un oggetto e ne voglio aggiungere un altro alla lista 
            if(vm.selectedItem != null && vm.listSelected.indexOf(item)== -1  && vm.listAll.length==0){

                vm.listSelected.push(item);
                console.log("2 ----> è gia stato selezionato un oggetto e ne voglio aggiungere un altro alla lista ")
                return
            }

            // voglio deselezionare il singolo oggetto che appartiene anche alla lista degli oggetti selezionati
            if (vm.listSelected.indexOf(item)!= -1 && vm.selectedItem == item  && vm.listAll.length==0 && vm.auxDel ==0){
                var index = vm.listSelected.indexOf(item);
                vm.selectedItem = null;
                vm.listSelected.splice(index,1);
                console.log("3 ----->  voglio deselezionare il singolo oggetto che appartiene anche alla lista degli oggetti selezionati");
                if(vm.listSelected.length == 1){
                    console.log("3.1------> controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem ");
                     vm.selectedItem = vm.listSelected[0];
                     return
                }
                return;
             }

             // voglio deselezionare un oggetto che appartiene solo alla lista dei selezionati
              if (vm.listSelected.indexOf(item)!= -1 && vm.selectedItem != item  && vm.listAll.length==0){
                var index = vm.listSelected.indexOf(item);
                vm.listSelected.splice(index,1);
                console.log("4-------> voglio deselezionare un oggetto che appartiene solo alla lista dei selezionati");
                // controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem
              if(vm.listSelected.length == 1){
                 console.log("4.1------> controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem ");
                 vm.selectedItem = vm.listSelected[0];
                 return
             }

                return;
         }

             // voglio deselezionare un oggetto che non appartiene alla lista dei selezionati
             if (vm.listSelected.indexOf(item)== -1 && vm.selectedItem == item  && vm.listAll.length==0){
                vm.selectedItem = null;
                console.log("5------> voglio deselezionare un oggetto che non appartiene alla lista dei selezionati");
                return;
             }


             // voglio deselezionare un elemento nella lista di tutti
             if(vm.listAll.indexOf(item)!= -1 && vm.selectedItem != item ){
                 var index = vm.listSelected.indexOf(item);
                 vm.listSelected.splice(index,1);
                 console.log(vm.listSelected);
                 var index2 = vm.listAll.indexOf(item);
                 vm.listAll.splice(index2,1);
                 console.log("6------> voglio deselezionare un elemento nella lista di tutti");
                 if(vm.listAll.length ==1){
                      console.log("6.1------> controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem ");
                     vm.selectedItem = vm.listAll[0];
                    return;
              }
                 return;
             }



             // ho cliccato 1 elemento, poi selezionato tutti e dopo voglio deselezionare 
             if(vm.selectedItem != null || vm.listSelected.length != 0 && vm.listAll.length == vm.items.length){
                 vm.selectedItem = null;
                 var index = vm.listSelected.indexOf(item);
                 vm.listSelected.splice(index,1);
                 console.log(vm.listSelected);
                 var index2 = vm.listAll.indexOf(item);
                 vm.listAll.splice(index2,1);
                 console.log("7------> ho cliccato 1 elemento, poi selezionato tutti e dopo voglio deselezionare ");
                 if(vm.listAll.length ==1){
                      console.log("7.1------> controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem ");
                     vm.selectedItem = vm.listAll[0];
                    return;
               }
                if(vm.listSelected.length == 1){
                 console.log("7.2------> controllo se vi è un elemento nella lista dei selezionati, allora esso è il nuovo selecteditem ");
                 vm.selectedItem = vm.listSelected[0];
                 return
             }

                 return;
             }

            vm.selectedItem = null;
            vm.listSelected.length=0;
            vm.listAll.length=0;
            
        }
    }
})();