/* global angular */

'use strict';

var myVersion = 7;
var OBJECT_STORE_ITEMS = 'items';

var dashboardDbApp = angular.module('dashboardDbApp', ['ui.bootstrap', 'ngTouch', 'ngResource', 'ngAnimate', 'dashboardDbControllers', 'dashboardFilters']);

var dashboardDbControllers = angular.module('dashboardDbControllers', ['xc.indexedDB']);

dashboardDbControllers.config(function ($indexedDBProvider) {
        $indexedDBProvider
        .connection('dashboard-localdb')
        .upgradeDatabase(myVersion, function(event, db, tx){
                //if(!db.objectStoreNames.contains(OBJECT_STORE_ITEMS)) {
                var osItems = db.createObjectStore(OBJECT_STORE_ITEMS, { keyPath: "id", autoIncrement:true});      			
                //osTipoDocumentos.createIndex("formato_idx", "tipo", { unique: false });
                //}
        });
});

dashboardDbControllers.directive('colorpicker', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            $(element).tinycolorpicker();
        }
    };
});

dashboardDbControllers.directive('iconpicker', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            $(element).iconpicker();
        }
    };
});

dashboardDbControllers.controller('DashboardCtrl', ['$scope', '$modal', '$log', '$indexedDB', 
    function($scope, $modal, $log,  $indexedDB) {			
        var itemsObjectStore = $indexedDB.objectStore(OBJECT_STORE_ITEMS);
        
        //init();
        
        function buscaItems() {
            itemsObjectStore.getAll().then(function(itemsList) {  
                    //persistanceService.buscaImoveis().then(function(imoveisList) {
                    $scope.listViewItems = itemsList;
            });
        };
        
        function init() {
            
            itemsObjectStore.clear();
            itemsObjectStore
            .insert({"nome": "LEO",
                    "cor": "#A80000",
                    "icone": "fa-soccer-ball-o",
            "updated":new Date()});
            itemsObjectStore
            .insert({"nome": "THAIS",
                    "cor": "#009933",				
                    "icone": "fa-soccer-ball-o",
            "updated":new Date()});
            itemsObjectStore
            .insert({"nome": "PEDRINHHO",
                    "cor": "#3399FF",
                    "icone": "fa-soccer-ball-o",
            "updated":new Date()});		
        };
        
              
        $scope.openConfigOverlay = function () {            
      
            var modalInstance = $modal.open({
                    templateUrl: 'config-overlay.html',
                    controller: 'ModalInstanceCtrl',
                    size:'lg',
                    resolve: {
                        modalListItems: function () {
                            return $scope.listViewItems;
                        }
                    }
            });
            
            modalInstance.result.then(function () {            
                    buscaItems();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };    
        
        if($indexedDB.onDatabaseError) {
            $location.path('/unsupported');
        } else {
            buscaItems();
            $log.info('Application Started at: ' + new Date());
        };
    }
]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

dashboardDbControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, modalListItems, $indexedDB) {
        
    $scope.disabled = [];  
    $scope.modalListItems = modalListItems;
    
    var itemsObjectStoreAlt = $indexedDB.objectStore(OBJECT_STORE_ITEMS);
    
    var lastIndex = 0;
    
    $scope.closeModal = function () {
        $modalInstance.close();
    };
    
    $scope.voltar = function () {
        $modalInstance.dismiss('cancel');
    };
            
    $scope.addItem = function() {
        $scope.modalListItems.push({nome: 'test',"cor": "#000000", "icone":"fa-ball", "updated":new Date()});
        lastIndex =  $scope.modalListItems.length - 1; 
        $scope.disabled[lastIndex] = false;   
    };
    
    $scope.updateItem = function(index) {          
        $scope.disabled[index] = ! $scope.disabled[index];       
    };
    
    $scope.saveItem = function(index) {
        $scope.disabled[index] = ! $scope.disabled[index];
        //$scope.modalListItems[index]
        itemsObjectStoreAlt
            .upsert($scope.modalListItems[index]);
    };
    
    $scope.cancelItem = function(index) {
        $scope.disabled[index] = ! $scope.disabled[index];
        if ($scope.modalListItems[index] != undefined){
              itemsObjectStore.find($scope.modalListItems[index].id).then(function(item) {
                    $scope.modalListItems[index] = item;
            });
        }else{
             $scope.removeItem(index);
        };
    };
    
    $scope.removeItem = function(index) {
        $scope.modalListItems.splice(index, 1);
        $scope.disabled[index] = ! $scope.disabled[index];
    };
    
    for(var index = 0; index < modalListItems.length; ++index){ 
        $scope.disabled[index] = true;
    }
        
});
