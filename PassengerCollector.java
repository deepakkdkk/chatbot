import java.util.*;

public class PassengerCollector {

    /**
     * Returns the maximum number of passengers that can be collected on an
     * outbound trip (0,0 -> n-1,n-1) restricted to moves Right/Down and the
     * corresponding return trip (n-1,n-1 -> 0,0) restricted to moves Up/Left.
     * Input is provided as a List of List of Integers where
     *   0 = empty cell, 1 = passenger, -1 = obstacle.
     *
     * @param gridList square matrix as a list of list of integers
     * @return maximum passengers that can be collected (0 if no valid path)
     */
    public int maxPassengers(List<List<Integer>> gridList) {
        int n = gridList.size();
        // Convert to primitive 2-D array for faster access in the DP.
        int[][] grid = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                grid[i][j] = gridList.get(i).get(j);
            }
        }
        return maxPassengers(grid);
    }

    // ---------------------------------------------------------------------
    //  Implementation below identical to classic "Cherry Pickup" DP, using
    //  two walkers moving from (0,0) to (n-1,n-1) simultaneously.
    // ---------------------------------------------------------------------

    private int maxPassengers(int[][] grid) {
        int n = grid.length;
        final int NEG_INF = Integer.MIN_VALUE / 2; // avoid overflow on +

        // dp[r1][r2] = best score after k steps with walker1 at (r1,c1) & walker2 at (r2,c2)
        int[][] dp = new int[n][n];
        for (int[] row : dp) Arrays.fill(row, NEG_INF);
        if (grid[0][0] != -1) dp[0][0] = grid[0][0];

        for (int k = 1; k <= 2 * (n - 1); k++) {
            int[][] next = new int[n][n];
            for (int[] row : next) Arrays.fill(row, NEG_INF);

            // r1 and r2 iterate over possible row indices at step k
            for (int r1 = Math.max(0, k - (n - 1)); r1 <= Math.min(n - 1, k); r1++) {
                int c1 = k - r1;
                if (c1 < 0 || c1 >= n || grid[r1][c1] == -1) continue; // obstacle or OOB

                for (int r2 = Math.max(0, k - (n - 1)); r2 <= Math.min(n - 1, k); r2++) {
                    int c2 = k - r2;
                    if (c2 < 0 || c2 >= n || grid[r2][c2] == -1) continue;

                    int bestPrev = maxPrev(dp, r1, r2);
                    if (bestPrev == NEG_INF) continue;

                    int gain = grid[r1][c1];
                    if (r2 != r1 || c2 != c1) gain += grid[r2][c2]; // avoid double-counting

                    next[r1][r2] = Math.max(next[r1][r2], bestPrev + gain);
                }
            }
            dp = next; // move to next layer
        }
        return Math.max(0, dp[n - 1][n - 1]);
    }

    // Retrieve max of the four previous DP states corresponding to each walker
    // coming from either Up or Left (since forward direction is Down/Right).
    private int maxPrev(int[][] dp, int r1, int r2) {
        int best = Integer.MIN_VALUE / 2;
        for (int dr1 = -1; dr1 <= 0; dr1++) {
            for (int dr2 = -1; dr2 <= 0; dr2++) {
                int pr1 = r1 + dr1;
                int pr2 = r2 + dr2;
                if (pr1 >= 0 && pr2 >= 0) {
                    best = Math.max(best, dp[pr1][pr2]);
                }
            }
        }
        return best;
    }

    // ---------------------------------------------------------------------
    // Quick demo -----------------------------------------------------------
    // ---------------------------------------------------------------------
    public static void main(String[] args) {
        List<List<Integer>> grid = Arrays.asList(
                Arrays.asList(0, 1, -1),
                Arrays.asList(1, 0, -1),
                Arrays.asList(1, 1,  1)
        );
        PassengerCollector pc = new PassengerCollector();
        System.out.println(pc.maxPassengers(grid)); // Expected output: 5
    }
}