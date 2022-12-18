export class DisjointSet<T extends string | number> {
    parent: { [key: string]: T } = {};
    rank: { [key: string]: number } = {};

    constructor(vals: Iterable<T>) {
        for (const val of vals) {
            this.parent[val] = val;
            this.rank[val] = 1;
        }
    }

    union(a: T, b: T) {
        const x = this.find(a);
        const y = this.find(b);

        if (x == y) {
            return;
        }

        if (this.rank[x] > this.rank[y]) {
            this.parent[y] = x;
            this.rank[x] += this.rank[y];
        } else {
            this.parent[x] = y;
            this.rank[y] += this.rank[x];
        }
    }

    find(a: T) {
        if (this.parent[a] != a) {
            this.parent[a] = this.find(this.parent[a]);
        }

        return this.parent[a];
    }
}
