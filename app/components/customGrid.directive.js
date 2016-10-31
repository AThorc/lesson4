(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('customGrid', customGrid);

    function customGrid() {
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
            controller: customGridController,
            controllerAs: 'customGridCtrl',
            transclude: true,
            restrict: 'E',
            templateUrl: 'app/components/customGrid.template.html' 
        };
    }


   customGridController.$inject = ['storageService'];

    //Directive controller
    function customGridController(storageService,customSearchFilter) {
        var vm = this;
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection;




/// per il bottone
      vm.topDirections = ['left', 'up'];
      vm.bottomDirections = ['down', 'right'];

     vm.isOpen = false;

 
      vm.selectedMode = 'md-fling';

      vm.availableDirections = ['up', 'down', 'left', 'right'];
      vm.selectedDirection = 'up';


      vm.auxDel = 0;
     //vm.changeDel = changeDel;
     vm.clickFab = 0;


//// PER la grid
    vm.buildGridModel = buildGridModel;
  



     function buildGridModel(){
           var i = 0;
           if(vm.items.length == 0){
               console.log("Non ci sono elementi in lista");
               return;
           }
           for (i = 0; i< vm.items.length ; i++){
               vm.items[i].col = 1;
               vm.items[i].row = 2;
               switch(i) {
                   case 0 :
                          // console.log(vm.items[i].col);
                          // vm.items[i].col = 2;
                          // vm.items[i].row = 2;
                           vm.items[i].background = "#B9E39F";
                          // console.log("Dentro il primo ITEM");
                         //  console.log(vm.items[i].background);
                           storageService.set(vm.items);
                           break;
                   case 1 :
                           vm.items[i].col = 2;
                           vm.items[i].row = 1;                   
                           vm.items[i].background = "#c8ceff";
                           storageService.set(vm.items);
                           break;
                   case 2 :
                           vm.items[i].background = "#ffc8c8";
                     //       vm.items[i].row =  vm.items[i].col = 1;
                            storageService.set(vm.items);
                           break;
                   case 3 :
                       //    vm.items[i].col = 2;
                         //  vm.items[i].row = 1;
                           vm.items[i].background = "#a8cef9";
                           storageService.set(vm.items);
                           break;
                   case 4 :
                       //    vm.items[i].col = 1;
                         //  vm.items[i].row = 2;                           
                           vm.items[i].background = "#f9f1ab";
                           storageService.set(vm.items);
                           break;      
                   case 5 :
                       //    vm.items[i].col = 1;
                         //  vm.items[i].row = 1;                   
                           vm.items[i].background = "#abf9ef";
                           storageService.set(vm.items);
                           break; 
                   case 6 :
                    //       vm.items[i].row =  vm.items[i].col = 2;
                           vm.items[i].background = "#f9ceab";
                           storageService.set(vm.items);
                           break; 
                   case 7 :
                       //    vm.items[i].col = 2;
                         //  vm.items[i].row = 1;                           
                           vm.items[i].background = "#ffd5fb";
                           storageService.set(vm.items);
                           break;  
                   case 8 :
                      //     vm.items[i].col = 1;
                        //   vm.items[i].row = 2;
                           vm.items[i].background = "#abf9ac";
                           storageService.set(vm.items);
                           break;        
                   case 9 :
                          //  vm.items[i].row =  vm.items[i].col = 2;
                            vm.items[i].background = "#81f0a4";
                            storageService.set(vm.items);
                           break;     
                   case 10 :
                        //    vm.items[i].col = 1;
                          //  vm.items[i].row = 1;
                            vm.items[i].background = "#9ef2f4";
                            storageService.set(vm.items);
                           break;    
                   case 11 :
                        //    vm.items[i].row = 1;
                          //  vm.items[i].col = 2;
                            vm.items[i].background = "#d3ffc2";
                            storageService.set(vm.items);
                           break;  
                   default :
                      //     vm.items[i].col = 1;
                        //   vm.items[i].row = 1;                   
                           vm.items[i].background = "#d6d6d6";
                           storageService.set(vm.items);
                           break;                                                                                                                                                                                                              

                        
               }

           }
           return vm.items;
       }


//////
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
                if(vm.clickFab == 1){
                    return;
                }
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
             if((vm.selectedItem != null || vm.listSelected.length != 0) && vm.listAll.length == vm.items.length){
                 console.log("List all");
                 console.log(vm.listAll.length);
                 console.log("list of items");
                 console.log(vm.items.length);
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

             if(vm.selectedItem == item && vm.auxDel ==0){
                 console.log("8------> vm.selectedItem == item && vm.auxDel ==0 ");
                 vm.selectedItem = null;
                 return;
             }

             
              console.log("9------> ALTRO ");
             console.log("Sel Item?");
             console.log(vm.selectedItem);
             console.log("List all?");
             console.log(vm.listAll);
             console.log("List selected?");
             console.log(vm.listSelected);
             console.log("Quanto vale auxDel?");
             console.log(vm.auxDel);
             vm.auxDel =0;
             vm.listSelected.length = 0;

        }



        ///



    }
})();