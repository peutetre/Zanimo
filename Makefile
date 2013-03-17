ZANIMO = zanimo
BUILDDIR = dist
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: build www

build: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

test:
	@@phantomjs test/launch.js

www:
	@@stylus www/css/style.styl
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js www/vendor/${ZANIMO}-${VERSION}.min.js
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.js www/vendor/${ZANIMO}-${VERSION}.js
	@@cp vendor/q-0.9.1.min.js www/vendor/q-0.9.1.min.js
	@@cp vendor/q-0.9.1.js www/vendor/q-0.9.1.js

clean:
	@@rm www/vendor/${ZANIMO}-${VERSION}.min.js
	@@rm www/vendor/${ZANIMO}-${VERSION}.js
	@@rm www/vendor/q-0.9.1.min.js
	@@rm www/vendor/q-0.9.1.js

.PHONY: test www
