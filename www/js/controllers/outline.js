
angular.module('outliner').controller('OutlineController', ['$scope', '$location', '$http', 'Outline', '$sce',
	function OutlineController($scope, $location, $http, Outline, $sce) {
		

		// This takes care of syncronizing with backend when moving
		$scope.treeOptions = {
			dropped: function(event) {

				var oldParent = event.source.nodesScope.$parent.$modelValue;
				var newParent = event.dest.nodesScope.$parent.$modelValue;

				var oldParentId = oldParent ? oldParent.id : null;
				var newParentId = newParent ? newParent.id : null;

				var movedOutline = event.source.nodeScope.$modelValue;
				movedOutline.parent_id = newParentId;
				movedOutline.index = event.dest.index;
				
				if(movedOutline.$update) {
					movedOutline.$update({}, function(value, responseHeaders) {
					}, function(httpResponse) {
						console.log(httpResponse);
					});
				}
			}
		};

		var numOutlines = 0;
		$scope.outlineList = [];

		// Fetch outlines from backend
		var outlines = Outline.query(function() {
			$(outlines).each(function(index, el) {
				el.selected = false;
				$scope.outlineList.push(el);
				resourcifyChildren(el);
				
			});
			console.log(outlines);
			
		});

		$scope.outlines = outlines;


		// When clicking on a outline name
		$scope.showContent = function(outline) {
			$scope.selectedOutline = outline;
		};
		

		$scope.removeOutline = function(scope) {
			var removed = scope.$modelValue;
			removed.$delete();
			scope.remove(scope);
			var removedIndex = $scope.outlineList.indexOf(removed);
			$scope.outlineList.splice(removedIndex, 1);	
		};

		$scope.addRoot = function() {

			console.log('Adding');
			var newChild = new Outline({ name: null, children: [], parent_id: null, 
				index: $scope.outlines.length });
			$scope.outlines.push(newChild);
			
			setTimeout(function() {
				$scope.outlineList.push(newChild);	
			}, 0);

			numOutlines++;
		}

		$scope.collapseAll = function() {
			var scope = getRootNodesScope();
			scope.collapseAll();
		};

		$scope.expandAll = function() {
			var scope = getRootNodesScope();
			scope.expandAll();
		};

		var getRootNodesScope = function() {
			return angular.element(document.getElementById("tree-root")).scope();
		};

		$scope.addOutline = function(scope) {
			
			var outline = scope.$modelValue;
			var children = outline.children || [];
			var newChild = new Outline({ name: null, children: [], parent_id: outline.id, 
				index: children.length });

			
			children.push(newChild);
			setTimeout(function() {
				$scope.outlineList.push(newChild);	
			}, 0);
			
			//newChild.$save();
			numOutlines++;
			console.log($scope.outlineList.length);
			console.log($scope.outlines.length);
			
		};

		var trusted = {};
		var placeholder = "Haga doble click para agregar contenido.";

		$scope.outlineHtml = function(outline) {

			var html = outline.content || placeholder;
			if(html === "") html = placeholder;

			return trusted[html] || (trusted[html] = $sce.trustAsHtml(html));
		}
		$scope.$watch($scope.outlineHtml, function() {

		});

		function resourcifyChildren(outline) {
			numOutlines++;
			$(outline.children).each(function(index, child) {
				outline.children[index] = new Outline(child);
				$scope.outlineList.push(outline.children[index]);
				resourcifyChildren(outline.children[index]);

			});
		}

	}]); 

