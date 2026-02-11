
        // Scene setup
   
        const canvas = document.getElementById('canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.position.z = 5;

        // Create small brown egg geometry (reusable)
        function createSmallEggGeometry() {
            const eggGeo = new THREE.SphereGeometry(0.08, 16, 16);
            const positions = eggGeo.attributes.position;
            
            for (let i = 0; i < positions.count; i++) {
                const y = positions.getY(i);
                const x = positions.getX(i);
                const z = positions.getZ(i);
                
                const scaleFactor = 1 + (y * 0.2);
                positions.setX(i, x * scaleFactor);
                positions.setZ(i, z * scaleFactor);
                positions.setY(i, y * 1.35);
            }
            
            return eggGeo;
        }

        // Create brown egg material with variation
        function createBrownEggMaterial() {
            // Random brown shades
            const brownShades = [
                0x8B6F47,  // Medium brown
                0xA0826D,  // Light brown
                0x7A5C3E,  // Dark brown
                0x9B7653,  // Tan brown
                0x6F5438   // Deep brown
            ];
            
            const randomColor = brownShades[Math.floor(Math.random() * brownShades.length)];
            
            return new THREE.MeshStandardMaterial({
                color: randomColor,
                roughness: 0.3,
                metalness: 0.05,
                emissive: randomColor,
                emissiveIntensity: 0.05
            });
        }

        // Particle system replaced with small 3D eggs
        const eggParticleCount = 100; // Reduced count since these are 3D objects
        const eggParticles = [];
        const velocities = [];
        
        const smallEggGeometry = createSmallEggGeometry();
        
        for (let i = 0; i < eggParticleCount; i++) {
            const eggMaterial = createBrownEggMaterial();
            const smallEgg = new THREE.Mesh(smallEggGeometry, eggMaterial);
            
            // Random position in space
            smallEgg.position.x = (Math.random() - 0.5) * 20;
            smallEgg.position.y = (Math.random() - 0.5) * 20;
            smallEgg.position.z = (Math.random() - 0.5) * 20;
            
            // Random rotation
            smallEgg.rotation.x = Math.random() * Math.PI * 2;
            smallEgg.rotation.y = Math.random() * Math.PI * 2;
            smallEgg.rotation.z = Math.random() * Math.PI * 2;
            
            // Random scale for variety
            const scale = 0.8 + Math.random() * 0.4;
            smallEgg.scale.set(scale, scale, scale);
            
            scene.add(smallEgg);
            eggParticles.push(smallEgg);
            
            // Store velocities
            velocities.push({
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015,
                rotX: (Math.random() - 0.5) * 0.02,
                rotY: (Math.random() - 0.5) * 0.02,
                rotZ: (Math.random() - 0.5) * 0.02
            });
        }

        // Create realistic main egg shape
        const eggGeometry = new THREE.SphereGeometry(1.5, 64, 64);
        
        // Modify geometry to make it egg-shaped
        const eggPositions = eggGeometry.attributes.position;
        for (let i = 0; i < eggPositions.count; i++) {
            const y = eggPositions.getY(i);
            const x = eggPositions.getX(i);
            const z = eggPositions.getZ(i);
            
            // Make bottom rounder and top pointier
            const scaleFactor = 1 + (y * 0.2);
            eggPositions.setX(i, x * scaleFactor);
            eggPositions.setZ(i, z * scaleFactor);
            eggPositions.setY(i, y * 1.35); // Stretch vertically
        }
        
        // Create procedural texture for realistic egg surface with logo
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 1024;
        textureCanvas.height = 1024;
        const ctx = textureCanvas.getContext('2d');
        
        // Base cream/beige color with realistic gradient
        const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
        gradient.addColorStop(0, '#faf4ed');
        gradient.addColorStop(0.4, '#f0e6d8');
        gradient.addColorStop(0.7, '#ead9c4');
        gradient.addColorStop(1, '#e3d0b8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 1024);
        
        // Add subtle speckles and texture
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 1.5;
            const opacity = Math.random() * 0.12;
            
            ctx.fillStyle = `rgba(170, 140, 110, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add larger brown spots (natural egg markings)
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 3 + 1.5;
            const opacity = Math.random() * 0.18 + 0.08;
            
            ctx.fillStyle = `rgba(130, 105, 80, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Load and apply logo
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = 'https://static.wixstatic.com/media/28eaf7_2a4998097c8342beac8d4cf04cbec74a~mv2.png/v1/fill/w_123,h_73,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20%20800%20X%20800%20PXL.png';
        
        let eggMaterial;
        let egg;
        
        logoImg.onload = function() {
            // Draw logo on the egg texture
            const logoWidth = 280;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = (1024 - logoWidth) / 2;
            const logoY = (1024 - logoHeight) / 2;
            
            // Add subtle shadow behind logo for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            const texture = new THREE.CanvasTexture(textureCanvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            
            // Create bump map for surface imperfections
            const bumpCanvas = document.createElement('canvas');
            bumpCanvas.width = 512;
            bumpCanvas.height = 512;
            const bumpCtx = bumpCanvas.getContext('2d');
            
            bumpCtx.fillStyle = '#808080';
            bumpCtx.fillRect(0, 0, 512, 512);
            
            for (let i = 0; i < 4000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = Math.random() * 1.2;
                const value = Math.random() * 50 + 105;
                
                bumpCtx.fillStyle = `rgb(${value}, ${value}, ${value})`;
                bumpCtx.beginPath();
                bumpCtx.arc(x, y, size, 0, Math.PI * 2);
                bumpCtx.fill();
            }
            
            const bumpMap = new THREE.CanvasTexture(bumpCanvas);
            
            // Realistic egg material with proper lighting - NO PURPLE TINT
            eggMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                bumpMap: bumpMap,
                bumpScale: 0.002,
                roughness: 0.25,
                metalness: 0.05,
                envMapIntensity: 0.3,
                color: 0xffffff // Pure white to avoid any color tinting
            });
            
            if (egg) {
                egg.material = eggMaterial;
            }
        };
        
        // Create egg with temporary material (will be replaced when logo loads)
        const tempMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0e6d8,
            roughness: 0.25,
            metalness: 0.05
        });
        
        egg = new THREE.Mesh(eggGeometry, tempMaterial);
        egg.castShadow = true;
        egg.receiveShadow = true;
        scene.add(egg);

        // Enhanced lighting for realism - WARM, NATURAL TONES
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.7);
        scene.add(ambientLight);

        // Main light - warm white
        const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        scene.add(mainLight);

        // Fill light - soft warm tone
        const fillLight = new THREE.DirectionalLight(0xffefd5, 0.5);
        fillLight.position.set(-3, 2, -3);
        scene.add(fillLight);

        // Back light - neutral warm
        const backLight = new THREE.DirectionalLight(0xfffaf0, 0.4);
        backLight.position.set(0, -2, -5);
        scene.add(backLight);

        // Rim light - bright white for edge highlighting
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
        rimLight.position.set(-5, 3, -2);
        scene.add(rimLight);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Scroll parallax effect
        let scrollY = 0;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        // Animation loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();
            
            // Rotate egg smoothly to show the logo
            egg.rotation.y = elapsedTime * 1.5 + scrollY * 0.001;
            egg.rotation.x = Math.sin(elapsedTime * 1.25) * 0.06;
            
            // Subtle floating motion
            egg.position.y = Math.sin(elapsedTime * 0.5) * 0.12;

            // Slight wobble for organic feel
            egg.rotation.z = Math.sin(elapsedTime * 0.35) * 0.04;

            // Animate small egg particles
            for (let i = 0; i < eggParticles.length; i++) {
                const eggParticle = eggParticles[i];
                const velocity = velocities[i];
                
                // Update position
                eggParticle.position.x += velocity.x;
                eggParticle.position.y += velocity.y;
                eggParticle.position.z += velocity.z;
                
                // Update rotation for tumbling effect
                eggParticle.rotation.x += velocity.rotX;
                eggParticle.rotation.y += velocity.rotY;
                eggParticle.rotation.z += velocity.rotZ;
                
                // Boundary checks with bounce
                if (Math.abs(eggParticle.position.x) > 10) {
                    velocity.x *= -1;
                    eggParticle.position.x = Math.sign(eggParticle.position.x) * 10;
                }
                if (Math.abs(eggParticle.position.y) > 10) {
                    velocity.y *= -1;
                    eggParticle.position.y = Math.sign(eggParticle.position.y) * 10;
                }
                if (Math.abs(eggParticle.position.z) > 10) {
                    velocity.z *= -1;
                    eggParticle.position.z = Math.sign(eggParticle.position.z) * 10;
                }
            }

            // Smooth mouse follow
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            
            camera.position.x = targetX * 1.2;
            camera.position.y = targetY * 1.2;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Parallax text scroll effect
        const parallaxTexts = document.querySelectorAll('.parallax-text');
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxTexts.forEach((text, index) => {
                const speed = (index % 2 === 0) ? 0.5 : -0.5;
                text.style.transform = `translateX(${scrolled * speed * 0.1}px)`;
            });
        });
