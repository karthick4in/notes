import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import expandCollapse from 'cytoscape-expand-collapse';
import 'cytoscape-expand-collapse/cytoscape-expand-collapse.css';

// Register the extension
expandCollapse(cytoscape);

const elements = [
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    { data: { id: 'c' } },
    { data: { id: 'd', parent: 'a' } },
    { data: { id: 'e', parent: 'a' } },
    { data: { id: 'ab', source: 'a', target: 'b' } },
    { data: { id: 'bc', source: 'b', target: 'c' } },
    { data: { id: 'cd', source: 'c', target: 'd' } }
];

const CytoscapeGraph = () => {
    const cyRef = useRef(null);

    useEffect(() => {
        const cy = cyRef.current;
        const api = cy.expandCollapse({
            layoutBy: {
                name: "grid",
                animate: "end",
                randomize: false,
                fit: true
            },
            fisheye: false,
            animate: true,
            undoable: false
        });

        // Collapse all nodes initially
        cy.ready(() => {
            api.collapseAll();
        });

        // Example of expanding all nodes on button click
        document.getElementById('expand').addEventListener('click', () => {
            api.expandAll();
        });

        // Example of collapsing all nodes on button click
        document.getElementById('collapse').addEventListener('click', () => {
            api.collapseAll();
        });

        // Clean up event listeners on unmount
        return () => {
            document.getElementById('expand').removeEventListener('click', () => {
                api.expandAll();
            });

            document.getElementById('collapse').removeEventListener('click', () => {
                api.collapseAll();
            });
        };
    }, []);

    return (
        <div>
            <button id="expand">Expand All</button>
            <button id="collapse">Collapse All</button>
            <CytoscapeComponent
                elements={elements}
                style={{ width: '600px', height: '600px' }}
                cy={(cy) => {
                    cyRef.current = cy;
                }}
            />
        </div>
    );
};

export default CytoscapeGraph;
