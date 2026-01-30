# Expanso.io - Astro Marketing Site

# Development server
dev:
    npm run dev

# Build for production
build:
    npm run build

# Preview production build
preview:
    npm run preview

# Type checking
check:
    npm run astro check

# Install dependencies
install:
    npm install

# Clean build artifacts
clean:
    rm -rf dist .astro

# Build and check (CI)
test: build check

# Full rebuild
rebuild: clean install build
