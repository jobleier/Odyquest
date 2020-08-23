package x.museum.quest.service

import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.withTimeout
import mu.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.data.mongodb.core.*
import org.springframework.data.mongodb.core.ReactiveFluentMongoOperations
import org.springframework.data.mongodb.core.oneAndAwait
import org.springframework.data.mongodb.core.query.isEqualTo
import org.springframework.stereotype.Service
import x.museum.quest.config.dev.adminUser
import x.museum.quest.entity.Chase
import x.museum.quest.entity.ChaseId
import java.time.LocalDateTime
import javax.validation.ConstraintValidatorFactory
import javax.validation.ValidatorFactory
import kotlin.reflect.full.isSubclassOf

@Service
class ChaseService(
        private val mongo: ReactiveFluentMongoOperations,
        @Lazy private val validatorFactory: ValidatorFactory
) {
    private val validator by lazy { validatorFactory.validator }


    /*******************************************
     *                 CREATE
     *******************************************/

    suspend fun create(chase: Chase): Chase {

        val newChase = chase.copy(
                quests = emptyList(),
                creationDate = LocalDateTime.now(),
                lastEdited = LocalDateTime.now(),
                lastEditor = adminUser
        )




        logger.trace { "Create new chase: $chase" }
        return withTimeout(timeoutShort) { mongo.insert<Chase>().oneAndAwait(newChase)}
    }

    /*******************************************
     *                  READ
     *******************************************/

    suspend fun findById(id: ChaseId): Chase? {
        println("service findById")
        val chase = withTimeout(timeoutShort) {
            mongo.query<Chase>()
                    .matching(Chase::id isEqualTo id)
                    .awaitOneOrNull()
        }
        logger.debug { "findById: $chase" }
        return chase
    }

    suspend fun findAll() = withTimeout(timeoutShort) {
        mongo.query<Chase>()
                .flow()
                .onEach { logger.debug { "findAll(): $it" } }
    }

    /*******************************************
     *                 UPDATE
     *******************************************/

    private suspend fun update(chase: Chase, chaseDb: Chase, version: Int): Chase {
        check(mongo::class.isSubclassOf(ReactiveMongoTemplate::class)) {
            "TODO"
        }
        mongo as ReactiveMongoTemplate
        val chaseCache: MutableCollection<*> = mongo.converter.mappingContext.persistentEntities
        chaseCache.remove(chaseDb)

        val newChase = chase.copy(id = chaseDb.id, version = version)
        logger.trace { "update: newChase = $newChase" }

        return withTimeout(timeoutShort) { mongo.save(newChase).awaitFirst() }
    }

    suspend fun update(chase: Chase, id: ChaseId, versionStr: String): Chase? {
        // TODO: validate(chase)

        val chaseDb = findById(id) ?: return null

        logger.trace { "update: version=$versionStr, chaseDB=$chaseDb" }
        val version = versionStr.toIntOrNull() ?: throw InvalidVersionException(versionStr)
        return  update(chase, chaseDb, version)
    }

    /*******************************************
     *                 DELETE
     *******************************************/

    suspend fun deleteById(id: ChaseId) = withTimeout(timeoutShort) {
        logger.debug { "deleteById(): id = $id" }
        val result = mongo.remove<Chase>()
                .matching(Chase::id isEqualTo id)
                .allAndAwait()
        logger.debug { "deleteById(): Deleted items = ${result.deletedCount}" }
        return@withTimeout result
    }

    /*******************************************
     *            Utility Functions
     *******************************************/

    private companion object {
        val logger = KotlinLogging.logger {}

        const val timeoutShort = 500L
        const val timeoutLong = 2000L
    }
}