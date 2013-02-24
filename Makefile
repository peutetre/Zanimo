ZANIMO = zanimo
BUILDDIR = build
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: build www3

build: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

test:
	@@phantomjs test/launch.js

www3:
	@@stylus www3/css/style.styl
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js www3/vendor/${ZANIMO}-${VERSION}.min.js
	@@cp ${BUILDDIR}/${ZANIMO}-${VERSION}.js www3/vendor/${ZANIMO}-${VERSION}.js
	@@cp vendor/q-0.8.11.min.js www3/vendor/q-0.8.11.min.js
	@@cp vendor/q-0.8.11.js www3/vendor/q-0.8.11.js

clean:
	@@rm www3/vendor/${ZANIMO}-${VERSION}.min.js
	@@rm www3/vendor/${ZANIMO}-${VERSION}.js
	@@rm www3/vendor/q-0.8.11.min.js
	@@rm www3/vendor/q-0.8.11.js

.PHONY: test www3
