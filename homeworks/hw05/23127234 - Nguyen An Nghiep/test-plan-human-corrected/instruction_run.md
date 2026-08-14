# Run JMeter simply in the VS Code terminal

No project-path variable is required. Open the `CSC13003-EShop` folder in VS Code and use two PowerShell terminals.

The correct syntax is `jmeter -n`, not `jmeter-n`.

## Terminal 1 — JMeter

Move from the repository root to the folder containing the three JMX files:

```powershell
cd ".\homeworks\hw05\23127234 - Nguyen An Nghiep\test-plan-human-corrected"
```

JMeter is already bundled in this folder. Create a short `jmeter` command for the current VS Code terminal:

```powershell
Set-Alias jmeter ".\tools\apache-jmeter-5.6.3\bin\jmeter.bat"
jmeter -v
mkdir results, reports -Force
```

If `jmeter` is already installed in your Windows PATH, skip `Set-Alias`.

## Terminal 2 — Backend

Open a second VS Code terminal from the repository root:

```powershell
cd backend
node server.js
```

Keep this terminal running. Wait for:

```text
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
```

## Run Load

In Terminal 1:

```powershell
jmeter -n -t 23127234_Load_20260812.jmx -l ./results/23127234_Load_20260812.jtl -e -o ./reports/load_html
```

After it finishes:

```powershell
start ./reports/load_html/index.html
```

## Run Stress

First, in Terminal 2, press `Ctrl+C`, then restart the backend:

```powershell
node server.js
```

In Terminal 1:

```powershell
jmeter -n -t 23127234_Stress_20260812.jmx -l ./results/23127234_Stress_20260812.jtl -e -o ./reports/stress_html
```

After it finishes:

```powershell
start ./reports/stress_html/index.html
```

## Run Spike

First, in Terminal 2, press `Ctrl+C`, then restart the backend:

```powershell
node server.js
```

In Terminal 1:

```powershell
jmeter -n -t 23127234_Spike_20260812.jmx -l ./results/23127234_Spike_20260812.jtl -e -o ./reports/spike_html
```

After it finishes:

```powershell
start ./reports/spike_html/index.html
```

## Required Endurance run

The homework requires a 10–15 minute endurance test. Reuse the Load JMX; do not create a fourth JMX file.

Restart the backend again, then run in Terminal 1:

```powershell
jmeter -n -t 23127234_Load_20260812.jmx "-Jload_threads=20" "-Jload_ramp_seconds=60" "-Jload_duration_seconds=900" -l ./results/23127234_Endurance_20260812.jtl -e -o ./reports/endurance_html
```

After it finishes:

```powershell
start ./reports/endurance_html/index.html
```

## When to take screenshots

Keep the JMeter terminal and Task Manager showing backend `node.exe` in the same frame.

| Run | Capture time |
|---|---|
| Load | During stable load and at the final `summary =` line |
| Stress | Near maximum load or first errors and at the final summary |
| Spike | Before surge, during surge, after recovery and at the final summary |
| Endurance | Near the start, middle and end |

Also capture each HTML dashboard after the run. Run `dxdiag` once and capture its System tab.

The three distinct JMeter views already stored in the plans are:

- Load: Summary Report.
- Stress: Aggregate Report.
- Spike: Aggregate Graph.

To capture one, open the plan in the GUI, enable only its assigned listener, browse to its JTL, take the screenshot, and close JMeter without saving.

Example:

```powershell
jmeter -t 23127234_Load_20260812.jmx
```

## If you rerun a test

JMeter does not overwrite an existing JTL or non-empty HTML report folder. Rename or move the old output first, or change the output names in the command, for example `load_html_2` and `23127234_Load_20260812_2.jtl`.
