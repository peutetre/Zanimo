ZANIMO = zanimo
BUILDDIR = build
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: build www

build: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

test:
	@@cd test && phantomjs specs.js

www:
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js www/vendor/${ZANIMO}-${VERSION}.min.js
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.js www/vendor/${ZANIMO}-${VERSION}.js
	@@cp vendor/q-0.8.9.min.js www/vendor/q-0.8.9.min.js
	@@cp vendor/q-0.8.9.js www/vendor/q-0.8.9.js

clean:
	@@rm www/vendor/${ZANIMO}-${VERSION}.min.js
	@@rm www/vendor/${ZANIMO}-${VERSION}.js
	@@rm www/vendor/q-0.8.9.min.js
	@@rm www/vendor/q-0.8.9.js

.PHONY: www test
