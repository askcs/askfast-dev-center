define(
    ['controllers/controllers', 'modals/askfast'],
    function(controllers, AskFast) {
        'use strict';

        controllers.controller('credits', [
            '$scope', '$rootScope','$routeParams','$timeout', 'AskFast', 'Session', 'Store', 'DTOptionsBuilder', 'DTColumnDefBuilder',
            function($scope, $rootScope, $routeParams, $timeout, AskFast, Session, Store, DTOptionsBuilder, DTColumnDefBuilder) {

                //Set all the propper hide and show for all the html ellements
                $scope.loading = true;
                $scope.PayPal = false;
                $scope.creditButton = true;
                $scope.creditForm = true;
                $scope.info= true;
                $scope.buyButton =true;

                var paymentMap= {};

                if ($routeParams.redirect == 'paypal') {
                    infoMessage("Congratulations your PayPal account is varified");
                };
                /**
                 * refresh the user info and save this in the store
                 *
                 */
                function refreshInfo(){
                AskFast.caller('info')
                    .then(function(info) {
                        $scope.paypallink = "http://sandbox.ask-fast.com/paymentserver/paypal?accountId="+info['id']+"&redirect_url=http://portal.ask-fast.com/#/credits?redirect=succesfullpaypal";
                        Store('app').save({
                            user: info
                        });
                    });
                }
                //Refreshe the data when page is loaded
                refreshInfo();

                //Get all the posible payment methods for the checkout 
                AskFast.caller('paymentMethods')
                    .then(function(result){
                        angular.forEach(result,function(paymentMethod){
                            paymentMap[paymentMethod['type']]=paymentMethod['id'];
                        })
                        $scope.methods = result;
                        $scope.PayPal = true;
                        $scope.creditButton = false;
                    });

                // Load all the previous payments and load these in the tabel
                AskFast.caller('getPayments')
                    .then(function(result) {
                            $scope.payments = result 
                            $scope.loading = false
                    });


                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    // Add Table tools compatibility
                    .withTableTools('../scripts/libs/datatables/1.10.4/extensions/TableTools/swf/copy_csv_xls_pdf.swf')
                    .withTableToolsButtons([
                        'copy',
                        'print', {
                            'sExtends': 'collection',
                            'sButtonText': 'Save',
                            'aButtons': ['csv', 'xls', 'pdf']
                        }
                    ])
                    .withOption('order',[[0, 'desc']]);

                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0),
                    DTColumnDefBuilder.newColumnDef(1),
                    DTColumnDefBuilder.newColumnDef(2)
                ];

                //Show the payment form 
                $scope.paymentform = function(){
                    $scope.creditButton = true;
                    $scope.creditForm = false;
                }

                //Show the final buy and cancel button
                $scope.proceedToCheckOut =function(){
                    $scope.checkoutButton = true;
                    $scope.buyButton =false;
                }

                //buy credits and give users proper feedback
                $scope.buycredits = function(order){
                    infoMessage('Working your request')
                    console.log(order.method)
                    var id = $scope.user["id"];
                    if(order && typeof order.amount !== 'undefined' && typeof order.method !== 'undefined'){
                        $scope.creditForm = true;
                        AskFast.caller("newPayment",null,{
                            paymentMethodId : paymentMap[order.method],
                            amount: order.amount
                        }).then(function(result){
                            infoMessage("Your payment is succesfull thank you");
                            refreshInfo();
                        })
                    }else{
                        infoMessage('Set amount and payment Type')
                    }
                }

                //hide the buy form when the buy is canceled
                $scope.abortSale = function(){
                    $scope.buyButton = true
                }

                //generic function to show the user a message, which will disapear after 3 seconds
                function infoMessage(message){
                    $scope.info=false;
                    $scope.infomessage = message
                    $timeout(function(){
                        $scope.info= true
                    },3000)
                }
            }
        ]);
    }
);
