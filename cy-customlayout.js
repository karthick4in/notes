 function applyCustomLayout() {
                // Group nodes by type
                const types = {};
                cy.nodes().forEach(node => {
                    const type = node.data('type');
                    if (!types[type]) {
                        types[type] = [];
                    }
                    types[type].push(node);
                });

                // Calculate positions
                const spacing = 100;
                let yOffset = 0;

                for (let type in types) {
                    let xOffset = 0;
                    types[type].forEach(node => {
                        node.position({ x: xOffset, y: yOffset });
                        xOffset += spacing;
                    });
                    yOffset += spacing;
                }

                cy.fit(); // Fit the graph to the viewport
            }

            document.getElementById('applyLayoutButton').addEventListener('click', applyCustomLayout);




 // Function to layout child nodes of a selected parent node
            function layoutChildren(parentNode) {
                const childNodes = parentNode.outgoers('node');
                const childCount = childNodes.length;

                // Determine layout positions for child nodes
                const parentPos = parentNode.position();
                const spacing = 100; // Adjust the spacing between child nodes as needed
                const startX = parentPos.x - (childCount - 1) * spacing / 2;

                childNodes.forEach((childNode, index) => {
                    childNode.position({
                        x: startX + index * spacing,
                        y: parentPos.y + spacing
                    });
                });
            }

            // Event listener for node clicks
            cy.on('tap', 'node', function(event) {
                const node = event.target;
                layoutChildren(node);
            });


        });
