/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */

/*jshint -W024 */
/*jshint -W030 */
/*jshint -W033 */
/*jshint -W082 */
/*jshint -W116 */
 
angular.module('ngBoilerplate.home', [
        'ui.router'
    ])

    /**
     * Each section or module of the site can also have its own routes. AngularJS
     * will handle ensuring they are all available at run-time, but splitting it
     * this way makes each module more "self-contained".
     */
    .config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl',
                    templateUrl: 'home/home.tpl.html'
                }
            },
            data: { pageTitle: 'Home' }
        });
    })

    /**
     * And of course we define a controller for our route.
     */
    .controller('HomeCtrl', function HomeController($scope) {

        $scope.cart = {};
        $scope.cart.items = [];
        $scope.excepts = ['books', 'food', 'medical'];
        $scope.option  = false;

        const tax_basic = 10;
        const tax_import = 5;

        const categories = [{
                alias: 'books',
                name: 'Books'
            },
            {
                alias: 'food',
                name: 'Food'
            },
            {
                alias: 'medical',
                name: 'Medical'
            },
            {
                alias: 'music-cd',
                name: 'Music CD'
            },
            {
                alias: 'perfume',
                name: 'Perfume'
            }
        ];

        function getCategoryByAlias(alias) {
            return categories.find(function(category, index) {
                if (category.alias == alias) {

                    function getTaxByCategory() {
                        if ($scope.excepts.indexOf(alias) == -1) return tax_basic
                        else return 0
                    }

                    return Object.assign(categories[index], {
                        taxes: [getTaxByCategory()]
                    });
                }
            });
        }

        var products = [
            {
                id: 0,
                name: 'Book',
                price: 12.49,
                category: getCategoryByAlias('books')
            },
            {
                id: 1,
                name: 'Music CD',
                price: 14.99,
                category: getCategoryByAlias('music-cd')
            },
            {
                id: 2,
                name: 'Chocolate Bar',
                price: 0.85,
                category: getCategoryByAlias('food')
            },
            {
                id: 3,
                name: 'Box of chocolates',
                price: 10,
                category: getCategoryByAlias('food'),
                imported: true
            },
            {
                id: 4,
                name: 'Bottle of perfume',
                price: 47.50,
                category: getCategoryByAlias('perfume'),
                imported: true
            },
            {
                id: 5,
                name: 'Bottle of perfume',
                price: 27.99,
                category: getCategoryByAlias('perfume'),
                imported: true
            },
            {
                id: 6,
                name: 'Bottle of perfume',
                price: 18.99,
                category: getCategoryByAlias('perfume')
            },
            {
                id: 7,
                name: 'Packet of headache pills',
                price: 9.75,
                category: getCategoryByAlias('medical')
            },
            {
                id: 8,
                name: 'Box of chocolates',
                price: 11.25,
                category: getCategoryByAlias('food'),
                imported: true
            }
        ];

        function getProductById(id) {
            return products.find(function(product, index) {
                if (product.id == id) {
                    return products[index];
                }
            });
        }

        function productInsert(productId, amount) {

            return new Promise(function(resolve, reject) {

                try {
                    var product = angular.copy(Object.assign(getProductById(productId), {
                        amount: amount
                    }));

                    // is imported?
                    if (product && product.imported) { product.category.taxes.push(tax_import) }

                    var subtotal = product.amount * product.price;
                    var tax = (subtotal * product.category.taxes.reduce(function(acc, val) { return acc + val; })) / 100; //%

                    tax = (Math.ceil(tax * 20) / 20).toFixed(2);

                    product.values = {
                        taxrate: Number(tax),
                        subtotal: Number(subtotal),
                        total: Number(subtotal) + Number(tax)
                    };

                    $scope.cart.items.push(product)
                    resolve()

                } catch (e) {
                    reject(e)
                }

            });

        }

        $scope.update = function() {

            function calcTaxes() {
                return $scope.cart.items.reduce(function(a, b) {
                    return a + b['values']['taxrate'];
                }, 0)
            }

            function calcTotal() {
                return $scope.cart.items.reduce(function(a, b) {
                    return a + b['values']['total'];
                }, 0)
            }

            $scope.cart.taxes = calcTaxes().toFixed(2);
            $scope.cart.total = calcTotal().toFixed(2);

            $scope.$digest();

        };


        $scope.setup = function(option) {
            
            $scope.cart.items = [];

            switch (option) {

                case 1:
                    $scope.option = option;
                    Promise.resolve()
                    .then(productInsert(0, 1)) // 1 book at 12.49
                    .then(productInsert(1, 1)) // 1 music CD at 14.99
                    .then(productInsert(2, 1)) // 1 chocolate bar at 0.85
                    .then(function() {
                        $scope.update();

                    }).catch(function(error) {
                        console.log('Error', error);
                    });

                    break;

                case 2:
                    $scope.option = option;
                    Promise.resolve()
                    .then(productInsert(3, 1)) // 1 imported box of chocolates at 10.00
                    .then(productInsert(4, 1)) // 1 imported bottle of perfume at 47.50
                    .then(function() {
                        $scope.update();

                    }).catch(function(error) {
                        console.log('Error', error);
                    });

                    break;

                case 3:
                    $scope.option = option;
                    Promise.resolve()
                    .then(productInsert(5, 1)) // 1 imported bottle of perfume at 27.99
                    .then(productInsert(6, 1)) // 1 bottle of perfume at 18.99
                    .then(productInsert(7, 1)) // 1 packet of headache pills at 9.75
                    .then(productInsert(8, 1)) // 1 box of imported chocolates at 11.25
                    .then(function() {
                        $scope.update();

                    }).catch(function(error) {
                        console.log('Error', error);
                    });

                    break;
            }
        }

    })

;