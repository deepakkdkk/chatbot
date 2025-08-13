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
    public int maxPassengers(List<List<Integer>> grid) {
        int n = grid.size();
        final int NEG_INF = Integer.MIN_VALUE / 2;

        // dp[r1][r2] – best after k steps with walker1 at (r1,c1) and walker2 at (r2,c2)
        int[][] dp = new int[n][n];
        for (int[] row : dp) Arrays.fill(row, NEG_INF);
        if (grid.get(0).get(0) != -1) dp[0][0] = grid.get(0).get(0);

        for (int k = 1; k <= 2 * (n - 1); k++) {
            int[][] next = new int[n][n];
            for (int[] row : next) Arrays.fill(row, NEG_INF);

            for (int r1 = Math.max(0, k - (n - 1)); r1 <= Math.min(n - 1, k); r1++) {
                int c1 = k - r1;
                if (c1 < 0 || c1 >= n || grid.get(r1).get(c1) == -1) continue;

                for (int r2 = Math.max(0, k - (n - 1)); r2 <= Math.min(n - 1, k); r2++) {
                    int c2 = k - r2;
                    if (c2 < 0 || c2 >= n || grid.get(r2).get(c2) == -1) continue;

                    int bestPrev = maxPrev(dp, r1, r2);
                    if (bestPrev == NEG_INF) continue;

                    int gain = grid.get(r1).get(c1);
                    if (r2 != r1 || c2 != c1) gain += grid.get(r2).get(c2);

                    next[r1][r2] = Math.max(next[r1][r2], bestPrev + gain);
                }
            }
            dp = next;
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