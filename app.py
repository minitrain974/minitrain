from flask import Flask, render_template, request, jsonify
import networkx as nx

app = Flask(__name__)

# All the available APIs

# Start Page
@app.route('/')
def index():
    return render_template('index.html')

# POST method to calculate the Minimum Spanning Tree
@app.route('/calculate_mst', methods=['POST'])
def calculate_mst():
    data = request.get_json()
    distances = data.get('distances', [])
    
    # Convert the distances to a list of edges
    edges = []
    for d in distances:
        start = (d['start']['lat'], d['start']['lng'])
        end = (d['end']['lat'], d['end']['lng'])
        edges.append((d['distance'], start, end))

    # Calculate the MST
    mst = calculate_minimum_spanning_tree(edges)
    
    return jsonify(mst)

def calculate_minimum_spanning_tree(edges):
    # Kruskal's algorithm to find the MST
    # Step 1: Sort edges by weight (distance)
    edges.sort()

    # Step 2: Create a union-find data structure
    parent = {}
    rank = {}
    
    def find(node):
        if parent[node] != node:
            parent[node] = find(parent[node])
        return parent[node]
    
    def union(node1, node2):
        root1 = find(node1)
        root2 = find(node2)
        
        if root1 != root2:
            if rank[root1] > rank[root2]:
                parent[root2] = root1
            else:
                parent[root1] = root2
                if rank[root1] == rank[root2]:
                    rank[root2] += 1
    
    # Initialize the union-find structure
    nodes = set()
    for _, start, end in edges:
        nodes.add(start)
        nodes.add(end)
        parent[start] = start
        parent[end] = end
        rank[start] = 0
        rank[end] = 0

    # Step 3: Add edges to the MST
    mst = []
    for weight, start, end in edges:
        if find(start) != find(end):
            union(start, end)
            mst.append({
                'start': {'lat': start[0], 'lng': start[1]},
                'end': {'lat': end[0], 'lng': end[1]},
                'distance': weight
            })

    return mst

if __name__ == '__main__':
    app.run(debug=True)
