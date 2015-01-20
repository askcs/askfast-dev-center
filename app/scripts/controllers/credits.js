define(
    ['controllers/controllers', 'modals/askfast'],
    function(controllers, AskFast) {
        'use strict';

        controllers.controller('credits', [
            '$scope', '$rootScope','$routeParams','$timeout', '$location', '$filter', 'AskFast', 'Session', 'Store', 'DTOptionsBuilder', 'DTColumnDefBuilder',
            function($scope, $rootScope, $routeParams, $timeout, $location, $filter, AskFast, Session, Store, DTOptionsBuilder, DTColumnDefBuilder) {

                //Set all the proper hide and show for all the html elements
                $scope.loading = true;
                $scope.paypal = {
                    showButton: false,
                    link: ''
                };
                $scope.payment = {
                    showCreditButton: false,
                    showCreditForm: false,
                    showCheckoutButton: false,
                    showConfirm: false
                };
                $scope.infomessage = '';
                $scope.order = {};

                $scope.creditBuyOptions = (function(){
                    // will go from increment up to and including max
                    var options = [],
                        max = 100,
                        increment = 10,
                        i = increment;

                    while(i <= max){
                        options.push({value: i, // using "&euro;" doesn't work when not done in view
                                       name: $filter('currency')(i, '€')});
                        i = i + increment;
                    }
                    return options;
                }());

                var paymentMap= {};

                if ($routeParams.redirect === 'successfulpaypal') {
                    infoMessage('Congratulations, your PayPal account is verified!');
                }
                /**
                 * refresh the user info and save this in the store
                 *
                 */
                function refreshInfo(){
                AskFast.caller('info')
                    .then(function(info) {
                        $scope.paypal.link = $rootScope.config.host +
                                            '/paymentserver/paypal?accountId=' + info.id +
                                            '&redirect_url=' + $location.absUrl() + '?redirect=successfulpaypal';
                        Store('app').save({
                            user: info
                        });
                        $rootScope.user = info;
                    });
                }
                //Refresh the data when page is loaded
                refreshInfo();

                //Get all the posible payment methods for the checkout
                AskFast.caller('paymentMethods')
                .then(function(result){
                    var methods = [];
                    // If no authorized payment methods, empty array
                    // Only authorized methods are given.
                    angular.forEach(result,function(paymentMethod){
                        paymentMap[paymentMethod.type] = paymentMethod.id;
                    });
                    if(typeof paymentMap.PAYPAL !== 'undefined'){
                        if($rootScope.config.feature.paypal === true){
                            methods.push({name: 'PayPal', value: 'PAYPAL'});
                        }
                    }
                    else{
                        // PayPal isn't authorized, make it possible to do so
                        $scope.paypal.showButton = true;
                    }

                    $scope.methods = methods;

                    if(methods.length !== 0){
                        $scope.payment.showCreditButton = true;
                    }
                });

                // Load all the previous payments and load these in the tabel
                function getPayments(){
                    $scope.loading = true;
                    AskFast.caller('getPayments')
                    .then(function(result) {
                        $scope.payments = result;
                        $scope.loading = false;
                    });
                }

                getPayments();

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
                    $scope.payment.showCreditButton = false;
                    $scope.payment.showCreditForm = true;
                    $scope.payment.showCheckoutButton = true;
                };

                //Show the final buy and cancel button
                $scope.proceedToCheckOut = function(){
                    // use falsiness, options could have value of '' or undefined
                    if($scope.order && $scope.order.amount && $scope.order.method){
                        $scope.payment.showCheckoutButton = false;
                        angular.element('.order-option').attr('disabled', 'disabled');
                        $scope.payment.showConfirm = true;
                    }else{
                        infoMessage('Please select both an amount and a payment method.');
                    }
                };

                //buy credits and give users proper feedback
                $scope.buycredits = function(order){
                    infoMessage('Processing your request...', true);
                    var id = $scope.user.id;
                    if(order && typeof order.amount === 'number' && typeof order.method === 'string' ){
                        AskFast.caller('newPayment',null,{
                            paymentMethodId : paymentMap[order.method],
                            amount: order.amount
                        }).then(function(result){ //success
                            if (angular.isDefined(result.id) &&
                                angular.isDefined(result.amount) &&
                                angular.isDefined(result.type))
                            {
                                infoMessage('Your payment of ' + $filter('currency')(result.amount, '€') + ' was successful, thank you.');
                                refreshInfo();
                                getPayments();
                                $scope.abortSale(); // Just to reset everything
                            }
                            else{
                                infoMessage('Something went wrong with the transaction');
                                refreshInfo();
                                getPayments();
                                $scope.abortSale();
                            }
                        },function(result){ //failure
                            infoMessage('Something went wrong with the transaction');
                            refreshInfo();
                            getPayments();
                            $scope.abortSale();
                        });
                    }else{
                        infoMessage('Please select both an amount and a payment method.');
                    }
                };

                //hide the buy form when the buy is canceled
                $scope.abortSale = function(){
                    // reset options
                    angular.element('.order-option').removeAttr('disabled').val(null);
                    $scope.order = {};

                    $scope.payment.showCreditButton = true;
                    $scope.payment.showCreditForm = false;
                    $scope.payment.showCheckoutButton = false;
                    $scope.payment.showConfirm = false;
                };

                //generic function to show the user a message, which will disapear after 5 seconds
                function infoMessage(message, permanent){
                    $scope.infomessage = message;
                    if(permanent !== true){
                        $timeout(function(){
                            $scope.infomessage = '';
                        }, 5000);
                    }
                }
            }
        ]);
    }
);
