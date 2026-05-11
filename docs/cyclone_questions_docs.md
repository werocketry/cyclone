# Contraption Filament Winder Project - Cyclone Software Documentation

## Software Overview

### Cyclone Purpose and Architecture

**Primary Function:** Control software for Marlin-driven filament winders
**Workflow:** Node.js scripts generate G-code → Marlin firmware executes commands → Motors create wound tubes
**Repository:** https://github.com/reilleya/cyclone

### Development Status and Roadmap

**Current State:** Functional command-line interface with known installation challenges
**Planned Improvements:**

- GUI interface for easier use
- Executable distribution (.exe/.app) to eliminate Node.js setup requirements
- Enhanced documentation and user experience
- Custom controller board integration for V2

## Installation and Setup

### Common Installation Issues

#### Canvas Dependency Problems

**Primary Issue:** Canvas library installation failures on Windows systems
**Symptoms:**

- Permission errors during `npm install canvas`
- Build failures with native module compilation
- Installation works initially but runtime failures occur

**Solutions:**

1. **Remove Canvas Dependency (Recommended):**

   - Edit `package.json`: Remove canvas and @types/canvas dependencies
   - Edit `cli-entry.ts`: Comment out `import { plotGCode } from './plotter';`
   - Remove entire plotting code block
   - Delete `plot.ts` and related plotting files

2. **Alternative Fix:**
   - Try `npm install canvas@latest` for version compatibility
   - Run installation as administrator (mixed success)

#### Directory Navigation Issues

**Common Error:** Running commands from wrong directory
**Solution:** Ensure terminal is in `cyclone-main` directory before running `npm` commands
**Verification:** Check that `package.json` exists in current directory with `dir` command

#### OneDrive Sync Conflicts

**Issue:** OneDrive automatic syncing interferes with Node.js module installation
**Solution:** Download and extract Cyclone to local directory (Desktop, Documents) not OneDrive-synced locations

### Successful Installation Process

```bash
# 1. Clone or download Cyclone repository
# 2. Navigate to cyclone-main directory
cd cyclone-main

# 3. Install dependencies (with canvas removed)
npm i

# 4. Build the project
npm run build

# 5. Test G-code generation
npm run cli -- plan -o output.gcode input.wind
```

## Controller Configuration

### Hardware Requirements

**Recommended Setup:**

- BigTreeTech Octopus V1.1 controller
- TMC2209 drivers (standard) or TMC5160T (high-performance)
- NEMA 23 motors (mandrel and carriage)
- NEMA 17 motor (delivery head)

### Marlin Firmware Setup

**Firmware File:** Pre-compiled binary available from Andrew Reilley
**Installation:** Place firmware.bin on SD card, power cycle controller
**Configuration:** Apply M503 settings for proper acceleration and speed limits

**Critical Settings:**

- Steps/mm calibration essential for pattern accuracy
- Acceleration limits must be reduced from 3D printer defaults
- Motor current settings match driver capabilities
- Stepper driver types correctly specified

### Alternative Controller Options

**Smaller Boards:** SKR series sufficient for 3-axis operation
**Future Expansion:** 5+ channels needed for advanced features (4th axis, closed-loop tensioning)
**Custom Board:** Planned for V2 with integrated load cell input

## Wind File Configuration

### Basic Structure

```json
{
  "layers": [
    {
      "windType": "helical",
      "windAngle": 55,
      "patternNumber": 1,
      "skipIndex": 1,
      "lockDegrees": 360,
      "leadInMM": 15,
      "leadOutDegrees": 90,
      "skipInitialNearLock": true
    }
  ],
  "mandrelParameters": {
    "diameter": 88.9,
    "windLength": 254
  },
  "towParameters": {
    "width": 4.5,
    "thickness": 0.154
  },
  "defaultFeedRate": 2000
}
```

### Layer Types and Parameters

#### Helical Layers

- **windAngle**: Fiber angle relative to mandrel axis
- **patternNumber**: Pattern complexity (affects coverage)
- **lockDegrees**: Rotation for pattern closure (typically 360°)
- **leadInMM**: Distance for gradual angle transition
- **skipInitialNearLock**: Avoids double-locking at start

#### Hoop Layers

- **Simplified Parameters**: No angle specification required
- **Application**: Circumferential reinforcement layers

### Critical Parameter Accuracy

**Mandrel Diameter:** Must be precisely measured for pattern closure
**Tow Width:** Affects coverage calculation and gap elimination
**Wind Length:** Defines active winding area

## Command Line Operations

### G-code Generation

```bash
# Standard generation
npm run cli -- plan -o output.gcode input.wind

# Without output file (terminal display)
npm run cli -- plan input.wind
```

### G-code Execution

```bash
# Serial streaming with progress
npm run cli -- run -p <PORT> input.gcode

# SD card method (copy gcode to SD, use Marlin interface)
```

### Debugging and Validation

```bash
# Plot wind pattern (requires canvas)
npm run cli -- plot -o output.png input.gcode

# Validate JSON formatting
# Use online JSON validators for wind file syntax
```

## Calibration and Precision

### Steps/Millimeter Calculation

**X-Axis (Carriage):** Based on belt pitch and pulley teeth
**Y-Axis (Mandrel):** Rotational steps per degree
**Z-Axis (Delivery Head):** Gear ratio dependent

**Example Calculations:**

- Belt drive: (steps_per_revolution) / (belt_pitch × pulley_teeth)
- Direct drive: (steps_per_revolution) / 360

### Precision Testing Protocol

1. **Single Rotation Test:** G0 Y360 should return to exact start position
2. **Extended Test:** G0 Y3600 (10 rotations) reveals cumulative errors
3. **Load Testing:** Test with actual tow tension for realistic conditions
4. **Fine Tuning:** Adjust M92 values to 6+ decimal places if necessary

### StealthChop Considerations

**Issue:** Silent driver mode can introduce positioning errors
**Solution:** Disable StealthChop for precision applications
**Trade-off:** Increased noise vs improved accuracy

## Advanced Features and Modifications

### Skip Index Parameter

**Status:** Defined in types but not implemented in core planner
**Purpose:** Intended for backlash compensation in gear-driven systems
**Implementation:** Requires modification of planner.ts line 261
**Community Contribution:** UMD team identified missing implementation

### Nosecone Winding Capability

**Status:** Experimental success achieved
**Method:** Use major diameter for mandrel parameter
**Limitations:**

- Overlap on smaller diameter sections unavoidable
- Post-processing (turning/grinding) required
- Hoop winding more successful than helical for cones
  **Mathematical Constraint:** Geodesic paths create necessary overlap

### Multi-Spool Operations

**Spool Change Mid-Wind:**

- Use pause functionality during turnaround zones
- Manual tow replacement and hand-wrapping for restart
- Alternative: Generate separate G-code files for before/after spool change

**Filament Runout Detection:**

- IR breakbeam sensors can trigger pause
- Similar to 3D printer filament sensors
- Automated spool change workflow possible

## Version Control and Collaboration

### Community Forks

**WE Rocketry Version:** https://github.com/werocketry/cyclone

- Fixed canvas dependency issues
- GUI development in progress
- Enhanced 6" diameter tube capability
- Nosecone geometry research

### Open Source Development

**Collaboration Welcome:** Community contributions actively sought
**Focus Areas:**

- Installation issue resolution
- GUI development
- Advanced geometry support
- Calibration utilities

### Configuration File Sharing

**Standard Practice:** Share M503 outputs and configuration files
**Pinned Resources:** Andrew Reilley's configurations available as reference
**Documentation:** Community maintaining shared configuration repository

## Troubleshooting Guide

### Pattern Closure Issues

**Symptoms:** Helical layers don't complete, diamond gaps in coverage
**Root Causes:**

- Inaccurate steps/mm calibration
- Mechanical backlash in gear systems
- StealthChop positioning errors
- Insufficient precision in step calculations

**Solutions:**

- Precision calibration with extended rotation tests
- Disable StealthChop mode
- Calculate steps/mm to high precision
- Verify mechanical system tightness

### Software Runtime Errors

**Node.js Version Conflicts:**

- Ensure compatible Node.js and npm versions
- Avoid version mismatches that prevent script execution
- Use stable LTS Node.js versions

**Package Management:**

- Run npm i in correct directory (cyclone-main)
- Verify package.json presence
- Clean install if dependency conflicts occur

### G-code Validation

**NCViewer Simulation:** Visualize G-code before execution
**Pattern Verification:** Use plotting function to verify coverage
**Timing Estimates:** Cross-check estimated vs actual wind times

## Performance Optimization

### Speed Enhancement

**Motor Upgrades:** NEMA 23 motors for mandrel and carriage
**Driver Upgrades:** TMC5160T for higher performance
**Acceleration Tuning:** Balance speed vs precision requirements

**Typical Performance:**

- 0.07" wall, 2.75" ID, 40" long tube: ~1 hour 15 minutes
- Multi-spool capability for larger tubes without mid-wind changes
- Speed improvements through acceleration optimization

### Large Diameter Considerations

**6" Diameter Tubes:** Require speed increases and potentially multi-spool setup
**Processing Time:** Scales significantly with diameter and length
**Hardware Limits:** Controller and motor capabilities become constraints

## Future Development Roadmap

### GUI Development

**Priority:** Eliminate command-line complexity for general users
**Features:** Visual wind file editor, real-time monitoring, configuration management
**Distribution:** Standalone executables for major platforms

### Advanced Motion Control

**4th Axis:** Delivery head angle control for complex geometries
**Closed-Loop:** Encoder feedback for precision positioning
**Tension Control:** Integration with V2 creel system

### Enhanced Geometry Support

**Variable Angle Winding:** Non-geodesic paths for optimized structures
**Complex Mandrels:** STL-based geometry input
**Multi-Material:** Coordinated control of multiple tow sources

---

_This documentation represents the collective knowledge and troubleshooting experience of the Cyclone user community, providing practical guidance for installation, configuration, and operation of the filament winder control software._
