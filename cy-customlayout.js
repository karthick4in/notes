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
        });
